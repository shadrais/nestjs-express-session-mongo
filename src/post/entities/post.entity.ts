import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Post {
  @Prop({ unique: true })
  postId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
