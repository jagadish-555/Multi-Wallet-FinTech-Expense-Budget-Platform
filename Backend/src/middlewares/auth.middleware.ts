import { NextFunction, Request, Response } from 'express';
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
    const err = error as { name?: string };

    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }

    if (err.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token'));
    }

    return next(error);
  }
};
