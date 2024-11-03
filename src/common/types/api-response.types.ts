// Base response interface that all responses will extend
export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
}

// Success response interface
export interface IApiSuccessResponse<T> extends IApiResponse<T> {
  success: true;
  data: T;
}

// Error response interface
export interface IApiErrorResponse extends IApiResponse<null> {
  success: false;
  error: {
    code: string;
    details?: string;
  };
}

// Pagination metadata interface
export interface IPaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Paginated response interface
export interface IPaginatedResponse<T> extends IApiSuccessResponse<T[]> {
  meta: IPaginationMeta;
}
