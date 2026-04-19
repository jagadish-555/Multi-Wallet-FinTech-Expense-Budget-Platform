import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { analyticsService } from '../services/analytics.service';
import { ApiError } from '../utils/ApiError';

export const analyticsController = {
  getSummary: asyncHandler(async (req: Request, res: Response) => {
    const result = await analyticsService.getSummary(req.user!.id);
    res.status(200).json(new ApiResponse(200, result, 'Summary fetched successfully'));
  }),

  getByCategory: asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: string; to?: string };

    if (!from || !to) {
      throw ApiError.badRequest('Query params "from" and "to" are required (YYYY-MM-DD)');
    }

    const result = await analyticsService.getByCategory(req.user!.id, from, to);
    res.status(200).json(new ApiResponse(200, result, 'Category breakdown fetched successfully'));
  }),

  getMonthlyTrend: asyncHandler(async (req: Request, res: Response) => {
    const months = req.query.months ? Number(req.query.months) : 6;
    const result = await analyticsService.getMonthlyTrend(req.user!.id, months);
    res.status(200).json(new ApiResponse(200, result, 'Monthly trend fetched successfully'));
  }),
};
