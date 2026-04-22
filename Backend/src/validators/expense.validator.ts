import { z } from 'zod';

const amountSchema = z.coerce.number().positive('Amount must be positive').max(9999999999.99);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const createExpenseSchema = z.object({
  amount: amountSchema,
  currency: z.string().length(3, 'Currency must be 3 characters').default('INR'),
  description: z.string().min(1, 'Description is required').max(255),
  categoryId: z.string().uuid('Invalid category ID'),
  expenseDate: dateSchema,
  recurringId: z.string().uuid('Invalid recurring expense ID').optional().nullable(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

const expenseFilterBaseSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID').optional(),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const expenseFilterSchema = expenseFilterBaseSchema.refine((data) => {
  if (!data.from || !data.to) {
    return true;
  }

  return new Date(data.from) <= new Date(data.to);
}, {
  message: 'from date must be less than or equal to to date',
  path: ['from'],
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;
