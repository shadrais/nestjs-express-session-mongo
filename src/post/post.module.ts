import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Post, PostSchema } from 'src/post/entities/post.entity';
import { UsersModule } from 'src/users/users.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: async (connection: Connection) => {
          const schema = PostSchema;
          const AutoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(AutoIncrement, { inc_field: 'postId' });

          schema.pre('save', function () {
            console.log('Pre-save middleware');
          });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    UsersModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
