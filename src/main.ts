import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import * as process from 'process';
import { SessionConfig } from 'src/config/session.config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  // Get session config service
  const sessionConfig = app.get(SessionConfig);

  // Security middleware
  app.use(helmet());

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Session middleware with MongoDB store
  app.use(session(sessionConfig.createSessionConfig()));

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
