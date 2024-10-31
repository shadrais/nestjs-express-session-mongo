import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { SessionConfig } from './session.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        SESSION_SECRET: Joi.string().required(),
        SESSION_MAX_AGE: Joi.number().required(),
        SESSION_RESAVE: Joi.boolean().required(),
        SESSION_SAVE_UNINITIALIZED: Joi.boolean().required(),
      }),
    }),
  ],
  providers: [SessionConfig],
  exports: [SessionConfig],
})
export class ConfigModule {}
