import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/auth/session.serializer';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
