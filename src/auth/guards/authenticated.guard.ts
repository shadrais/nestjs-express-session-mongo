import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse } from 'src/utils/response.utils';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated()) {
      const errorObj = ApiResponse.error(
        'Please login to access this resource',
        401,
        'Unauthorized',
      );
      throw new UnauthorizedException(errorObj);
    }

    return true;
  }
}
