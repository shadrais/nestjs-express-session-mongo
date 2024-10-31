import { Session } from 'express-session';
import { User } from 'src/users/entities/user.entity';

declare module 'express' {
  interface Request {
    session: Session & {
      // Add your custom session properties here
      email?: string;
      isAuthenticated?: boolean;
      // Add other custom properties as needed
    };
    user: User;
  }
}
