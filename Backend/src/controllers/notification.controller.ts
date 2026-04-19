import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { notificationService } from '../services/notification.service';

export const notificationController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.getAll(req.user!.id);
    res.status(200).json(new ApiResponse(200, result, 'Notifications fetched successfully'));
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAsRead(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Notification marked as read'));
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.id);
    res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.delete(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
  }),
};
