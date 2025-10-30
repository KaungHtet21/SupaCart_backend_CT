import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../constants';

export class JwtUtil {
  static generateAccessToken(payload: any, secret: string): string {
    return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  static generateRefreshToken(payload: any, secret: string): string {
    return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  static verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
