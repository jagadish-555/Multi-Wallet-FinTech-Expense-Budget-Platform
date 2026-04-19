import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(new ApiResponse(201, result, 'Account created successfully'));
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw ApiError.badRequest('Refresh token is required');
    const result = await authService.refresh(refreshToken);
    res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.getMe(req.user!.id);
    res.status(200).json(new ApiResponse(200, result, 'User fetched successfully'));
  }),
};
