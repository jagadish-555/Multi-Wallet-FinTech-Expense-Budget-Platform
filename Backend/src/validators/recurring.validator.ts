import { z } from 'zod';

const amountSchema = z.coerce.number().positive('Amount must be positive').max(9999999999.99);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const scheduleTypeSchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']);

export const createRecurringExpenseSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  amount: amountSchema,
  currency: z.string().length(3, 'Currency must be 3 characters').default('INR'),
  description: z.string().min(1, 'Description is required').max(255),
  scheduleType: scheduleTypeSchema,
  scheduleDay: z.coerce.number().int().min(0).max(31).optional().nullable(),
  startDate: dateSchema,
  endDate: dateSchema.optional().nullable(),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
}).refine((data) => {
  if (!data.endDate) {
    return true;
  }

  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'startDate must be less than or equal to endDate',
  path: ['startDate'],
});

export const updateRecurringExpenseSchema = createRecurringExpenseSchema.partial();

export type ScheduleTypeInput = z.infer<typeof scheduleTypeSchema>;
export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;
