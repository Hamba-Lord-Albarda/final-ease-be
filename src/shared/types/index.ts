// Shared TypeScript types or DTOs can live here
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
