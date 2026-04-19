import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { categoryService } from '../services/category.service';

export const categoryController = {
  // GET /api/v1/categories
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getAll(req.user!.id);
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  }),

  // POST /api/v1/categories
  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.user!.id, req.body);
    res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  }),

  // PATCH /api/v1/categories/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.update(req.user!.id, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
  }),

  // DELETE /api/v1/categories/:id
  delete: asyncHandler(async (req: Request, res: Response) => {
    await categoryService.delete(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
  }),
};
