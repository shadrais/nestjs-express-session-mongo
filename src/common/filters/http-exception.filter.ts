import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { IApiErrorResponse } from 'src/common/types/api-response.types';
import { ApiResponse } from 'src/utils/response.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: IApiErrorResponse;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      errorResponse = ApiResponse.error(
        Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : exceptionResponse.message || 'Bad Request',
        status,
        this.mapHttpStatusToErrorCode(status),
        Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : undefined,
      );
    } else if (exception instanceof MongooseError) {
      errorResponse = ApiResponse.error(
        'Database operation failed',
        HttpStatus.BAD_REQUEST,
        'DATABASE_ERROR',
        exception.message,
      );
    } else {
      const error = exception as Error;
      errorResponse = ApiResponse.error(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR',
        process.env.NODE_ENV === 'development' ? error.message : undefined,
      );
    }

    // Add request path
    errorResponse.path = request.url;

    // Log the error
    this.logger.error(
      `[${errorResponse.error.code}] ${errorResponse.message}`,
      'stack' in exception ? exception.stack : exception,
      GlobalExceptionFilter.name,
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private mapHttpStatusToErrorCode(status: number): string {
    const mappings: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };

    return mappings[status] || 'UNKNOWN_ERROR';
  }
}
