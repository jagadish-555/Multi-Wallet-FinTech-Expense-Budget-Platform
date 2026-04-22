import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
})

export const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  expenseDate: z.string().min(1, 'Date is required'),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex colour'),
})

export const budgetSchema = z.object({
  categoryId: z.string().optional(),
  limitAmount: z.coerce.number().positive('Limit must be positive'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  period: z.enum(['MONTHLY', 'ROLLING_30', 'PAYCHECK']),
  periodDay: z.coerce.number().min(1).max(31),
  startDate: z.string().min(1, 'Start date is required'),
})

export const recurringSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  description: z.string().min(1, 'Description is required'),
  scheduleType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  scheduleDay: z.coerce.number().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  timezone: z.string().min(1, 'Timezone is required'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
