import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator';

const router = Router();

router.use(authMiddleware);

router.get('/',      budgetController.getAll);
router.post('/',     validate(createBudgetSchema), budgetController.create);
router.patch('/:id', validate(updateBudgetSchema), budgetController.update);
router.delete('/:id', budgetController.delete);

export default router;
