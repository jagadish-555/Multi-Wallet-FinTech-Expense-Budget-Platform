import { Router } from 'express';
import authRoutes     from './auth.routes';
import categoryRoutes from './category.routes';
import expenseRoutes  from './expense.routes';

const router = Router();

router.use('/auth',       authRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses',   expenseRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
