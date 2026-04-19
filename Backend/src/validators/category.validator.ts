import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  icon: z.string().default('tag'),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').default('#6366f1'),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  isSystem: z.boolean().default(false),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
