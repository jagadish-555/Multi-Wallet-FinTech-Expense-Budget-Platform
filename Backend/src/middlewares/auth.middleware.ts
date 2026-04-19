import { NextFunction, Request, Response } from 'express';
import '../types/express-augment';
import prisma from '../config/database';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, currency: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    // Pass through ApiError instances (e.g., "No token provided")
    if (error instanceof ApiError) {
      return next(error);
    }

    const err = error as { name?: string };

    // All JWT-related errors → 401 (TokenExpiredError, JsonWebTokenError, SyntaxError from malformed payloads, etc.)
    const jwtErrorNames = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError', 'SyntaxError'];
    if (jwtErrorNames.includes(err.name ?? '')) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    return next(error);
  }
};
