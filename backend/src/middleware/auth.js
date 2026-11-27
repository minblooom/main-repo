// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom-dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'mindbloom-dev-refresh-secret-change-in-production';

export function signTokens(user) {
  const payload = {
    sub: user.id,
    nickname: user.nickname,
    ageBand: user.ageBand,
    gender: user.gender,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

export function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token.trim();
  }
  return null;
}

export async function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User session is no longer valid.' },
      });
    }
    req.user = user;
    next();
  } catch (err) {
    const isExpired = err?.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: {
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        message: isExpired ? 'Session expired.' : 'Invalid authentication token.',
      },
    });
  }
}

export async function optionalAuth(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (user) req.user = user;
  } catch {
    // Ignore invalid/expired token for optional auth routes
  }
  next();
}
