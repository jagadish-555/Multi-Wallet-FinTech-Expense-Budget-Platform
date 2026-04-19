import { z } from 'zod';

const amountSchema = z.coerce.number().positive('Limit must be positive').max(9999999999.99);

export const budgetPeriodSchema = z.enum(['MONTHLY', 'ROLLING_30', 'PAYCHECK']);

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
  limitAmount: amountSchema,
  currency: z.string().length(3, 'Currency must be 3 characters').default('INR'),
  period: budgetPeriodSchema.default('MONTHLY'),
  periodDay: z.coerce.number().int().min(1).max(28).optional(),
  isActive: z.boolean().default(true),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type BudgetPeriodInput = z.infer<typeof budgetPeriodSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

