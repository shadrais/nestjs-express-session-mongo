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
    try {
      console.log('serializeUser', user);
      done(null, user._id);
    } catch (err) {
      done(err, null);
    }
  }

  async deserializeUser(
    userId: string,
    done: (err: Error, payload: any) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      console.log('deserializeUser', user);

      if (!user) {
        done(null, null);
        return;
      }

      const { password, ...result } = user;
      done(null, result);
    } catch (err) {
      done(err as Error, null);
    }
  }
}
