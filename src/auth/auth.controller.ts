import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Request as TRequest, Response as TResponse } from 'express';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { ApiResponse } from 'src/utils/response.utils';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ApiResponse.success(
      user,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: TRequest) {
    return ApiResponse.success(
      req.user,
      'Logged in successfully',
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req: TRequest) {
    return ApiResponse.success(req.user, 'User profile retrieved successfully');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: TRequest, @Response() res: TResponse) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(null, 'Logged out successfully'));
    });
  }
}
