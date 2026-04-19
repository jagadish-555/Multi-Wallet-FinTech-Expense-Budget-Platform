import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 300,                          // BUG FIX: was 10 (way too low)
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 20,                           // BUG FIX: was 10 (too low)
  message: { success: false, message: 'Too many auth attempts, please wait 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
