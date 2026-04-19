import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/summary',        analyticsController.getSummary);
router.get('/by-category',    analyticsController.getByCategory);
router.get('/monthly-trend',  analyticsController.getMonthlyTrend);

export default router;
