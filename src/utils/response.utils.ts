import {
  IApiErrorResponse,
  IApiResponse,
  IPaginatedResponse,
} from 'src/common/types/api-response.types';

export class ApiResponse<T> implements IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;

  constructor(partial: Partial<IApiResponse<T>>) {
    this.success = partial.success ?? true;
    this.statusCode = partial.statusCode ?? 200;
    this.message = partial.message ?? 'Success';
    this.data = partial.data;
    this.timestamp = partial.timestamp ?? new Date().toISOString();
    this.path = partial.path;
  }

  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): IApiResponse<T> {
    return new ApiResponse({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  static error(
    message: string,
    statusCode = 500,
    errorCode = 'INTERNAL_SERVER_ERROR',
    details?: string,
  ): IApiErrorResponse {
    return {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      error: {
        code: errorCode,
        details,
      },
    };
  }

  static paginated<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
    message = 'Success',
    statusCode = 200,
  ): IPaginatedResponse<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      meta: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }
}
