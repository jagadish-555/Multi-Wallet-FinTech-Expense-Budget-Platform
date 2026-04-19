import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/',            notificationController.getAll);
router.patch('/read-all',  notificationController.markAllAsRead);
router.patch('/:id/read',  notificationController.markAsRead);
router.delete('/:id',      notificationController.delete);

export default router;
