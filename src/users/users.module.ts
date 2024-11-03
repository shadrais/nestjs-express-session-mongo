import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (connection: Connection) => {
          const schema = UserSchema;
          const AutoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(AutoIncrement, { inc_field: 'userId' });

          schema.pre('save', function () {
            console.log('Pre-save middleware');
          });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
