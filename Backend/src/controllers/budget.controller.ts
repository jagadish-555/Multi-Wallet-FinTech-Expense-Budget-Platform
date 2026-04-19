import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { budgetService } from '../services/budget.service';

export const budgetController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const budgets = await budgetService.getAllWithUsage(req.user!.id);
    res.status(200).json(new ApiResponse(200, budgets, 'Budgets fetched successfully'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const budget = await budgetService.create(req.user!.id, req.body);
    res.status(201).json(new ApiResponse(201, budget, 'Budget created successfully'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const budget = await budgetService.update(req.user!.id, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, budget, 'Budget updated successfully'));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await budgetService.delete(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Budget deleted successfully'));
  }),
};
