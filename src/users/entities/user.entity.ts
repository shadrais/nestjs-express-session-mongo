import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    select: false,
  })
  password?: string;

  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
