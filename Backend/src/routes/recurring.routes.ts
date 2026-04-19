import { Router } from 'express';
import { recurringController } from '../controllers/recurring.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecurringExpenseSchema, updateRecurringExpenseSchema } from '../validators/recurring.validator';

const router = Router();

router.use(authMiddleware);

router.get('/',              recurringController.getAll);
router.get('/:id',           recurringController.getById);
router.post('/',             validate(createRecurringExpenseSchema), recurringController.create);
router.patch('/:id',         validate(updateRecurringExpenseSchema), recurringController.update);
router.patch('/:id/pause',   recurringController.pause);
router.patch('/:id/resume',  recurringController.resume);
router.delete('/:id',        recurringController.delete);

export default router;
