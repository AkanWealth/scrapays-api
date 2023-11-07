import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor() {
    super({
      domain: 'dev-p7l7thbjct0j8yd4.us.auth0.com',
      clientID: 'nGRNKr7AFy3woR1u2d2hvRSjuVvjMW5S',
      clientSecret:
        'TjOfh5j7hMiXQlUQK6tVdcLzf5fo5jt_vr2K1LFXu2AZFghKSaLRX600symfHOxk',
      callbackURL: 'https://melodious-meerkat-67a2b8.netlify.app/',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any): any {
    return { accessToken, profile };
  }
}
