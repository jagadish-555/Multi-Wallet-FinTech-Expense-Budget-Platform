import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.use(authMiddleware);

router.get('/',    categoryController.getAll);
router.post('/',   validate(createCategorySchema), categoryController.create);
router.patch('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
