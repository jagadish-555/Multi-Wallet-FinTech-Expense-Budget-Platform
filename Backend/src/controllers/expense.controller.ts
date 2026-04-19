import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { expenseService } from '../services/expense.service';
import { expenseFilterSchema } from '../validators/expense.validator';
import { ApiError } from '../utils/ApiError';

export const expenseController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const parseResult = expenseFilterSchema.safeParse({
      ...req.query,
      tags: req.query.tags
        ? Array.isArray(req.query.tags)
          ? req.query.tags
          : [req.query.tags]
        : undefined,
    });

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(
        (i) => `${i.path.join('.')}: ${i.message}`
      );
      throw ApiError.badRequest(errors.join('; '));
    }

    const result = await expenseService.getAll(req.user!.id, parseResult.data);
    res.status(200).json(new ApiResponse(200, result, 'Expenses fetched successfully'));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.getById(req.user!.id, String(req.params.id));
    res.status(200).json(new ApiResponse(200, expense, 'Expense fetched successfully'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.create(req.user!.id, req.body);
    res.status(201).json(new ApiResponse(201, expense, 'Expense created successfully'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.update(req.user!.id, String(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, expense, 'Expense updated successfully'));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await expenseService.delete(req.user!.id, String(req.params.id));
    res.status(200).json(new ApiResponse(200, null, 'Expense deleted successfully'));
  }),
};
