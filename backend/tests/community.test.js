// backend/tests/community.test.js
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';
import { seedSpaces } from '../prisma/seed.js';

let server;
let baseUrl;

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

describe('MindBloom Community Spaces Backend', () => {
  let teenToken;
  let adultFemaleToken;
  let adultMaleToken;

  before(async () => {
    await prisma.messageReport.deleteMany();
    await prisma.circleMessage.deleteMany();
    await prisma.spaceMembership.deleteMany();
    await prisma.smallWin.deleteMany();
    await prisma.eventRsvp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.communitySpace.deleteMany();
    await seedSpaces();

    const app = createApp();
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}/api/v1`;

    const teenReg = await request('/auth/register', {
      method: 'POST',
      body: {
        nickname: 'TeenTester',
        contact: 'teen@example.com',
        password: 'password123',
        ageBand: '13-17',
        gender: 'female',
      },
    });
    teenToken = teenReg.json.data.accessToken;

    const femaleReg = await request('/auth/register', {
      method: 'POST',
      body: {
        nickname: 'AmaniTester',
        contact: 'amani@example.com',
        password: 'password123',
        ageBand: '18-24',
        gender: 'female',
      },
    });
    adultFemaleToken = femaleReg.json.data.accessToken;

    const maleReg = await request('/auth/register', {
      method: 'POST',
      body: {
        nickname: 'SimbaTester',
        contact: 'simba@example.com',
        password: 'password123',
        ageBand: '18-24',
        gender: 'male',
      },
    });
    adultMaleToken = maleReg.json.data.accessToken;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await prisma.$disconnect();
  });

  it('filters spaces by strict age cohort and gender alignment', async () => {
    const teenRes = await request('/community/spaces', { token: teenToken });
    assert.equal(teenRes.status, 200);
    const teenIds = teenRes.json.data.eligibleSpaces.map((s) => s.id);
    assert.ok(teenIds.includes('teen_exam_calm'));
    assert.ok(teenIds.includes('teen_sisterhood'));
    assert.ok(!teenIds.includes('campus_grounding'));
    assert.ok(!teenIds.includes('teen_brothers'));

    const maleRes = await request('/community/spaces', { token: adultMaleToken });
    const maleIds = maleRes.json.data.eligibleSpaces.map((s) => s.id);
    assert.ok(maleIds.includes('mens_grounding'));
    assert.ok(!maleIds.includes('sisterhood_sanctuary'));
    assert.ok(!maleIds.includes('teen_exam_calm'));
  });

  it('blocks cross-cohort and cross-gender access with 403', async () => {
    const crossCohort = await request('/community/circles/campus_grounding/messages', {
      token: teenToken,
    });
    assert.equal(crossCohort.status, 403);

    const crossGender = await request('/community/circles/sisterhood_sanctuary/messages', {
      token: adultMaleToken,
    });
    assert.equal(crossGender.status, 403);
  });

  it('spawns Cohort 2 overflow when joining a full 12/12 circle', async () => {
    const joinRes = await request('/community/circles/tulia_healing/join', {
      method: 'POST',
      token: adultFemaleToken,
    });
    assert.equal(joinRes.status, 200);
    assert.equal(joinRes.json.data.id, 'tulia_healing_part2');
    assert.equal(joinRes.json.data.isOverflowCohort, true);
    assert.equal(joinRes.json.data.cohortNumber, 2);
  });

  it('supports circle message CRUD, reactions, reporting, and 422 safety filter', async () => {
    const unsafe = await request('/community/circles/campus_grounding/messages', {
      method: 'POST',
      token: adultFemaleToken,
      body: { text: 'I want to die tonight' },
    });
    assert.equal(unsafe.status, 422);

    const created = await request('/community/circles/campus_grounding/messages', {
      method: 'POST',
      token: adultFemaleToken,
      body: { text: 'Taking a deep breath before Monday lectures.' },
    });
    assert.equal(created.status, 201);
    const msgId = created.json.data.id;

    const reacted = await request(`/community/circles/campus_grounding/messages/${msgId}/react`, {
      method: 'POST',
      token: adultMaleToken,
      body: { key: 'hugs' },
    });
    assert.equal(reacted.status, 200);
    assert.equal(reacted.json.data.reactions.hugs, 1);

    const edited = await request(`/community/circles/campus_grounding/messages/${msgId}`, {
      method: 'PATCH',
      token: adultFemaleToken,
      body: { text: 'Taking two deep breaths before Monday lectures.' },
    });
    assert.equal(edited.status, 200);
    assert.equal(edited.json.data.edited, true);

    await request(`/community/circles/campus_grounding/messages/${msgId}/report`, {
      method: 'POST',
      token: adultMaleToken,
      body: { reason: 'safety' },
    });

    const maleList = await request('/community/circles/campus_grounding/messages', {
      token: adultMaleToken,
    });
    assert.equal(maleList.json.data.items.some((m) => m.id === msgId), false);

    const deleted = await request(`/community/circles/campus_grounding/messages/${msgId}`, {
      method: 'DELETE',
      token: adultFemaleToken,
    });
    assert.equal(deleted.status, 200);
  });

  it('supports Small Wins and Event RSVPs', async () => {
    const winRes = await request('/community/wins', {
      method: 'POST',
      token: teenToken,
      body: { title: 'Finished my math revision without panicking', category: 'courage' },
    });
    assert.equal(winRes.status, 201);

    const cheerRes = await request(`/community/wins/${winRes.json.data.id}/cheer`, {
      method: 'POST',
      token: adultFemaleToken,
    });
    assert.equal(cheerRes.status, 200);
    assert.equal(cheerRes.json.data.cheerCount, 2);

    const rsvpRes = await request('/community/events/evt-nairobi-walk/rsvp', {
      method: 'POST',
      token: adultFemaleToken,
      body: { eventTitle: 'Karura Forest Grounding Walk', eventDateStr: 'Sat 10 AM' },
    });
    assert.equal(rsvpRes.status, 200);
    assert.equal(rsvpRes.json.data.isGoing, true);
    assert.equal(rsvpRes.json.data.rsvpCount, 1);
  });
});
