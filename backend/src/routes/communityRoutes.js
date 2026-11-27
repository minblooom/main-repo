// backend/src/routes/communityRoutes.js
import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import {
  canAccessSpace,
  matchSpacesForUser,
  normalizeAgeBand,
  serializeSpace,
} from '../services/cohortService.js';
import { analyzeTextSafety } from '../services/safetyService.js';
import { addSseClient, broadcastToSpace } from '../services/sseHub.js';

const router = Router();
const postLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

function parseJsonField(raw, fallback = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function serializeMessage(msg, currentUserId = null) {
  return {
    id: msg.id,
    spaceId: msg.spaceId,
    userId: msg.userId,
    sender: msg.senderNickname,
    emoji: msg.senderEmoji,
    text: msg.text,
    voiceNote: parseJsonField(msg.voiceNoteJson, null),
    replyTo: parseJsonField(msg.replyToJson, null),
    edited: msg.edited,
    reactions: parseJsonField(msg.reactionsJson, { hugs: 0, hearts: 0, pray: 0, green: 0 }),
    isMe: Boolean(currentUserId && msg.userId === currentUserId),
    createdAt: msg.createdAt,
  };
}

async function resolveSpaceWithAccess(req, res, spaceId) {
  const space = await prisma.communitySpace.findUnique({ where: { id: spaceId } });
  if (!space) {
    res.status(404).json({ success: false, message: 'Community space not found.' });
    return null;
  }
  if (req.user) {
    const access = canAccessSpace(req.user, space);
    if (!access.allowed) {
      res.status(403).json({
        success: false,
        error: { code: 'COHORT_RESTRICTED', message: access.reason },
        message: access.reason,
      });
      return null;
    }
  }
  return space;
}

// ── 1. COMMUNITY SPACES DISCOVERY & MATCHING ─────────────────────────────────

router.get('/spaces', optionalAuth, async (req, res) => {
  try {
    const ageBand = req.user?.ageBand || req.query.ageBand || '18-24';
    const gender = req.user?.gender || req.query.gender || 'prefer_not';
    const focusAreas = req.query.focusAreas ? String(req.query.focusAreas).split(',') : [];
    const interests = req.query.interests ? String(req.query.interests).split(',') : [];

    const [spaces, memberships] = await Promise.all([
      prisma.communitySpace.findMany({ orderBy: { createdAt: 'asc' } }),
      req.user
        ? prisma.spaceMembership.findMany({ where: { userId: req.user.id }, select: { spaceId: true } })
        : Promise.resolve([]),
    ]);

    const matched = matchSpacesForUser(spaces, {
      ageBand,
      gender,
      focusAreas,
      interests,
      joinedIds: memberships.map((m) => m.spaceId),
    });

    return res.json({ success: true, data: matched });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load community spaces.' });
  }
});

router.get('/spaces/:spaceId', optionalAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.spaceId);
    if (!space) return;

    let joined = false;
    if (req.user) {
      const membership = await prisma.spaceMembership.findUnique({
        where: { spaceId_userId: { spaceId: space.id, userId: req.user.id } },
      });
      joined = Boolean(membership);
    }

    return res.json({ success: true, data: serializeSpace(space, { joined }) });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load community space.' });
  }
});

// ── 2. CIRCLE MEMBERSHIP (WITH 12-MEMBER CAP & AUTO-OVERFLOW COHORT 2) ───────

router.post('/circles/:circleId/join', requireAuth, async (req, res) => {
  try {
    const baseSpace = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!baseSpace) return;

    let targetSpace = baseSpace;

    // Enforce 12-member cap for Baraza circles and spawn overflow Cohort 2 if full
    if (targetSpace.maxMembers && targetSpace.memberCount >= targetSpace.maxMembers) {
      const existingMembership = await prisma.spaceMembership.findUnique({
        where: { spaceId_userId: { spaceId: targetSpace.id, userId: req.user.id } },
      });

      if (!existingMembership) {
        const overflowId = `${targetSpace.id}_part2`;
        let overflowSpace = await prisma.communitySpace.findUnique({ where: { id: overflowId } });

        if (!overflowSpace) {
          overflowSpace = await prisma.communitySpace.create({
            data: {
              id: overflowId,
              type: targetSpace.type,
              title: `${targetSpace.title} · Cohort 2`,
              category: targetSpace.category,
              icon: targetSpace.icon,
              iconBg: targetSpace.iconBg,
              description: targetSpace.description,
              ageGroup: targetSpace.ageGroup,
              allowedGendersJson: targetSpace.allowedGendersJson,
              issuesJson: targetSpace.issuesJson,
              interestsJson: targetSpace.interestsJson,
              maxMembers: targetSpace.maxMembers,
              memberCount: 0,
              activeNow: 1,
              isOverflowCohort: true,
              parentCircleId: targetSpace.id,
              cohortNumber: 2,
            },
          });
        }
        targetSpace = overflowSpace;
      }
    }

    const existing = await prisma.spaceMembership.findUnique({
      where: { spaceId_userId: { spaceId: targetSpace.id, userId: req.user.id } },
    });

    if (!existing) {
      await prisma.$transaction([
        prisma.spaceMembership.create({
          data: { spaceId: targetSpace.id, userId: req.user.id },
        }),
        prisma.communitySpace.update({
          where: { id: targetSpace.id },
          data: { memberCount: { increment: 1 } },
        }),
      ]);
      targetSpace = await prisma.communitySpace.findUnique({ where: { id: targetSpace.id } });
    }

    return res.json({
      success: true,
      data: serializeSpace(targetSpace, { joined: true }),
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to join space.' });
  }
});

router.post('/circles/:circleId/leave', requireAuth, async (req, res) => {
  try {
    const space = await prisma.communitySpace.findUnique({ where: { id: req.params.circleId } });
    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found.' });
    }

    const existing = await prisma.spaceMembership.findUnique({
      where: { spaceId_userId: { spaceId: space.id, userId: req.user.id } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.spaceMembership.delete({ where: { id: existing.id } }),
        prisma.communitySpace.update({
          where: { id: space.id },
          data: { memberCount: Math.max(0, space.memberCount - 1) },
        }),
      ]);
    }

    return res.json({ success: true, data: { spaceId: space.id, joined: false } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to leave space.' });
  }
});

// ── 3. CIRCLE MESSAGES & REAL-TIME SSE STREAM ────────────────────────────────

router.get('/circles/:circleId/messages', optionalAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.per_page, 10) || 30));

    let reportedIds = [];
    if (req.user) {
      const reports = await prisma.messageReport.findMany({
        where: { spaceId: space.id, reporterId: req.user.id },
        select: { messageId: true },
      });
      reportedIds = reports.map((r) => r.messageId);
    }

    const rows = await prisma.circleMessage.findMany({
      where: {
        spaceId: space.id,
        ...(reportedIds.length > 0 ? { id: { notIn: reportedIds } } : {}),
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const items = rows.map((m) => serializeMessage(m, req.user?.id || null));
    return res.json({ success: true, data: { items, page, perPage } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load messages.' });
  }
});

router.get('/circles/:circleId/stream', requireAuth, async (req, res) => {
  const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
  if (!space) return;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ spaceId: space.id })}\n\n`);

  const removeClient = addSseClient(space.id, res);
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 25_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient();
  });
});

router.post('/circles/:circleId/messages', requireAuth, postLimiter, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const { text = '', senderEmoji, voiceNote = null, replyTo = null } = req.body || {};
    const trimmed = String(text || '').trim();

    if (!trimmed && !voiceNote) {
      return res.status(400).json({ success: false, message: 'Message text or voice note required.' });
    }

    const safety = analyzeTextSafety(trimmed);
    if (safety.isCritical) {
      return res.status(422).json({
        success: false,
        error: { code: 'SAFETY_INTERVENTION', tier: safety.tier },
        message: 'We care about your safety. Please reach out to a crisis helpline or trusted person.',
      });
    }

    const created = await prisma.circleMessage.create({
      data: {
        spaceId: space.id,
        userId: req.user.id,
        senderNickname: req.user.nickname,
        senderEmoji: senderEmoji || req.user.companionEmoji || '🌱',
        text: trimmed,
        voiceNoteJson: voiceNote ? JSON.stringify(voiceNote) : null,
        replyToJson: replyTo ? JSON.stringify(replyTo) : null,
      },
    });

    const payload = serializeMessage(created, null);
    broadcastToSpace(space.id, 'message:created', payload);

    return res.status(201).json({
      success: true,
      data: serializeMessage(created, req.user.id),
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to post message.' });
  }
});

router.patch('/circles/:circleId/messages/:messageId', requireAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const msg = await prisma.circleMessage.findUnique({ where: { id: req.params.messageId } });
    if (!msg || msg.spaceId !== space.id) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    if (msg.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own messages.' });
    }

    const trimmed = String(req.body?.text || '').trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
    }

    const safety = analyzeTextSafety(trimmed);
    if (safety.isCritical) {
      return res.status(422).json({
        success: false,
        error: { code: 'SAFETY_INTERVENTION', tier: safety.tier },
        message: 'We care about your safety. Please reach out to a crisis helpline or trusted person.',
      });
    }

    const updated = await prisma.circleMessage.update({
      where: { id: msg.id },
      data: { text: trimmed, edited: true },
    });

    broadcastToSpace(space.id, 'message:updated', { id: updated.id, text: updated.text, edited: true });
    return res.json({ success: true, data: serializeMessage(updated, req.user.id) });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to edit message.' });
  }
});

router.delete('/circles/:circleId/messages/:messageId', requireAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const msg = await prisma.circleMessage.findUnique({ where: { id: req.params.messageId } });
    if (!msg || msg.spaceId !== space.id) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    if (msg.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own messages.' });
    }

    await prisma.circleMessage.delete({ where: { id: msg.id } });
    broadcastToSpace(space.id, 'message:deleted', { id: msg.id });

    return res.json({ success: true, data: { id: msg.id } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
});

router.post('/circles/:circleId/messages/:messageId/react', requireAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const key = String(req.body?.key || '').trim();
    if (!['hugs', 'hearts', 'pray', 'green'].includes(key)) {
      return res.status(400).json({ success: false, message: 'Invalid reaction key.' });
    }

    const msg = await prisma.circleMessage.findUnique({ where: { id: req.params.messageId } });
    if (!msg || msg.spaceId !== space.id) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const reactions = parseJsonField(msg.reactionsJson, { hugs: 0, hearts: 0, pray: 0, green: 0 });
    reactions[key] = (reactions[key] || 0) + 1;

    const updated = await prisma.circleMessage.update({
      where: { id: msg.id },
      data: { reactionsJson: JSON.stringify(reactions) },
    });

    broadcastToSpace(space.id, 'message:reacted', { id: updated.id, reactions });
    return res.json({ success: true, data: { id: updated.id, reactions } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to react to message.' });
  }
});

router.post('/circles/:circleId/messages/:messageId/report', requireAuth, async (req, res) => {
  try {
    const space = await resolveSpaceWithAccess(req, res, req.params.circleId);
    if (!space) return;

    const msg = await prisma.circleMessage.findUnique({ where: { id: req.params.messageId } });
    if (!msg || msg.spaceId !== space.id) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    await prisma.messageReport.upsert({
      where: { messageId_reporterId: { messageId: msg.id, reporterId: req.user.id } },
      update: { reason: String(req.body?.reason || 'safety') },
      create: {
        messageId: msg.id,
        spaceId: space.id,
        reporterId: req.user.id,
        reason: String(req.body?.reason || 'safety'),
      },
    });

    return res.json({ success: true, data: { reported: true } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to report message.' });
  }
});

// ── 4. SMALL WINS ────────────────────────────────────────────────────────────

router.get('/wins', optionalAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(req.query.per_page, 10) || 20));

    const wins = await prisma.smallWin.findMany({
      where: { isPublic: true },
      include: { user: { select: { id: true, nickname: true, ageBand: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return res.json({ success: true, data: { items: wins, page, perPage } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load small wins.' });
  }
});

router.post('/wins', requireAuth, postLimiter, async (req, res) => {
  try {
    const { title, category = 'personal', isPublic = true } = req.body || {};
    const trimmed = String(title || '').trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, message: 'Win title is required.' });
    }

    const safety = analyzeTextSafety(trimmed);
    if (safety.isCritical) {
      return res.status(422).json({
        success: false,
        message: 'We care about your safety. Please reach out to a crisis helpline or trusted person.',
      });
    }

    const validCat = ['mindfulness', 'routine', 'courage', 'healing', 'personal'].includes(category)
      ? category
      : 'personal';

    const win = await prisma.smallWin.create({
      data: {
        userId: req.user.id,
        title: trimmed,
        category: validCat,
        isPublic: Boolean(isPublic),
      },
    });

    return res.status(201).json({ success: true, data: win });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to create small win.' });
  }
});

router.post('/wins/:id/cheer', requireAuth, async (req, res) => {
  try {
    const win = await prisma.smallWin.findUnique({ where: { id: req.params.id } });
    if (!win) {
      return res.status(404).json({ success: false, message: 'Small win not found.' });
    }
    const updated = await prisma.smallWin.update({
      where: { id: win.id },
      data: { cheerCount: { increment: 1 } },
    });
    return res.json({ success: true, data: updated });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to cheer small win.' });
  }
});

// ── 5. CHILL SPACE EVENT RSVPs ───────────────────────────────────────────────

router.get('/events/rsvps', optionalAuth, async (req, res) => {
  try {
    const allRsvps = await prisma.eventRsvp.findMany();
    const counts = {};
    const myEventIds = [];

    for (const rsvp of allRsvps) {
      counts[rsvp.eventId] = (counts[rsvp.eventId] || 0) + 1;
      if (req.user && rsvp.userId === req.user.id) {
        myEventIds.push(rsvp.eventId);
      }
    }

    return res.json({ success: true, data: { myEventIds, counts } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load event RSVPs.' });
  }
});

router.post('/events/:id/rsvp', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { eventTitle, eventDateStr } = req.body || {};

    const existing = await prisma.eventRsvp.findUnique({
      where: { eventId_userId: { eventId, userId: req.user.id } },
    });

    let isGoing = false;
    if (existing) {
      await prisma.eventRsvp.delete({ where: { id: existing.id } });
      isGoing = false;
    } else {
      await prisma.eventRsvp.create({
        data: {
          eventId,
          userId: req.user.id,
          eventTitle: eventTitle || null,
          eventDateStr: eventDateStr || null,
        },
      });
      isGoing = true;
    }

    const rsvpCount = await prisma.eventRsvp.count({ where: { eventId } });
    return res.json({ success: true, data: { isGoing, rsvpCount } });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to update RSVP.' });
  }
});

export default router;
