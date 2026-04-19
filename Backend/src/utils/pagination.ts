import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '../config/constants';

export const getPagination = (page = 1, limit = PAGINATION_DEFAULT_LIMIT) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Number(limit) || PAGINATION_DEFAULT_LIMIT;
  const take = Math.min(Math.max(parsedLimit, 1), PAGINATION_MAX_LIMIT);
  const skip = (parsedPage - 1) * take;
  return { take, skip };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || PAGINATION_DEFAULT_LIMIT, 1);

  return {
    total,
    page: normalizedPage,
    limit: normalizedLimit,
    totalPages: Math.ceil(total / normalizedLimit),
    hasNextPage: normalizedPage * normalizedLimit < total,
    hasPrevPage: normalizedPage > 1,
  };
};
