import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator';

const router = Router();

router.use(authMiddleware);

router.get('/',     expenseController.getAll);
router.get('/:id',  expenseController.getById);
router.post('/',    validate(createExpenseSchema), expenseController.create);
router.patch('/:id', validate(updateExpenseSchema), expenseController.update);
router.delete('/:id', expenseController.delete);

export default router;
