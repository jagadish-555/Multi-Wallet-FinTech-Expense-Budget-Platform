import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return next(new ApiError(400, 'Validation failed', errors));
    }

    req.body = result.data;
    return next();
  };
};
