import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as MongoDBStore from 'connect-mongodb-session';
import * as session from 'express-session';

@Injectable()
export class SessionConfig {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(SessionConfig.name);
  private sessionExpiry = 1000 * 60 * 30; // 30 minutes

  createSessionConfig(): session.SessionOptions {
    const MongoDBSessionStore = MongoDBStore(session);

    const store = new MongoDBSessionStore({
      uri: this.configService.get<string>('MONGODB_URI'),
      collection: 'sessions',
      expires: this.sessionExpiry,
    });

    // Handle store errors
    store.on('error', (error) => {
      this.logger.error(error);
    });

    store.on('connected', () => {
      this.logger.debug('MongoDB session store connected');
    });

    return {
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: this.configService.get<boolean>('SESSION_RESAVE'),
      saveUninitialized: false,
      store: store,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: this.sessionExpiry,
      },
      name: 'sessionId', // Custom cookie name
    };
  }
}
