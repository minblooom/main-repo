// backend/src/routes/authRoutes.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { normalizeAgeBand } from '../services/cohortService.js';
import { requireAuth, signTokens } from '../middleware/auth.js';

const router = Router();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'mindbloom-dev-refresh-secret-change-in-production';

function sanitizeUser(user) {
  return {
    id: user.id,
    nickname: user.nickname,
    contact: user.contact,
    ageBand: user.ageBand,
    gender: user.gender,
    companionEmoji: user.companionEmoji,
    createdAt: user.createdAt,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { nickname, contact, password, ageBand, gender, companionEmoji } = req.body || {};
    if (!nickname || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nickname and password are required.',
      });
    }

    const normalizedContact = contact ? String(contact).trim().toLowerCase() : null;
    if (normalizedContact) {
      const existing = await prisma.user.findUnique({ where: { contact: normalizedContact } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this contact already exists.',
        });
      }
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: {
        nickname: String(nickname).trim(),
        contact: normalizedContact,
        passwordHash,
        ageBand: normalizeAgeBand(ageBand),
        gender: String(gender || 'prefer_not').toLowerCase().trim(),
        companionEmoji: companionEmoji || '🌱',
      },
    });

    const tokens = signTokens(user);
    return res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user), ...tokens },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and password are required.',
      });
    }

    const normalized = String(identifier).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { contact: normalized } });
    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const tokens = signTokens(user);
    return res.json({
      success: true,
      data: { user: sanitizeUser(user), ...tokens },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    const tokens = signTokens(user);
    return res.json({ success: true, data: tokens });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ success: true, data: sanitizeUser(req.user) });
});

export default router;
