import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly validPassword = 'yF2146gzyefut61';

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const password = request.headers['password'];

    if (!password || password !== this.validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return true;
  }
}
