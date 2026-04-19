import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { recurringService } from '../services/recurring.service';

export const recurringController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const schedules = await recurringService.getAll(req.user!.id);
    res.status(200).json(new ApiResponse(200, schedules, 'Recurring expenses fetched successfully'));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const schedule = await recurringService.getById(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, schedule, 'Recurring expense fetched successfully'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const schedule = await recurringService.create(req.user!.id, req.body);
    res.status(201).json(new ApiResponse(201, schedule, 'Recurring expense created successfully'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const schedule = await recurringService.update(req.user!.id, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, schedule, 'Recurring expense updated successfully'));
  }),

  pause: asyncHandler(async (req: Request, res: Response) => {
    await recurringService.pause(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Recurring expense paused'));
  }),

  resume: asyncHandler(async (req: Request, res: Response) => {
    await recurringService.resume(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Recurring expense resumed'));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await recurringService.delete(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Recurring expense deleted'));
  }),
};
