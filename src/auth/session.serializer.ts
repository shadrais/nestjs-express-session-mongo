import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error, user: Types.ObjectId) => void,
  ): any {
    done(null, user._id);
  }

  async deserializeUser(
    userId: string,
    done: (err: Error, payload: any) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOne(userId);
      const { password, ...result } = user;
      done(null, result);
    } catch (err) {
      done(err, null);
    }
  }
}
