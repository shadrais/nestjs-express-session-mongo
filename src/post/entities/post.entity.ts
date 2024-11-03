import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Post {
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

export type PostDocument = HydratedDocument<Post>;
