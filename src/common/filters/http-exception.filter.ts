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

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';
    let error: string | undefined;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Handle validation errors and other structured errors
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || message;
        error = exceptionResponse.error;
        stack = exceptionResponse.stack;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof MongooseError) {
      message = exception.message;
      error = 'Database Error';
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      stack = exception.stack;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (error) {
      errorResponse.error = error;
    }

    // Log the error for debugging (you might want to use a proper logger)
    this.logger.error(exception, JSON.stringify(errorResponse), stack);

    response.status(status).json(errorResponse);
  }
}
