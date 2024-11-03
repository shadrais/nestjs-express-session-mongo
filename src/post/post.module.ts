import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/post/entities/post.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
