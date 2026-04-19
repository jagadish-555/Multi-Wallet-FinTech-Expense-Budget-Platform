import type { RequestUser } from './index';

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser;
  }
}
