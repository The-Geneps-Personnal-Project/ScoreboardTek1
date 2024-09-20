import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const password = request.headers['password'];

    const validPassword = this.configService.get<string>('REQUEST_PASSWORD');

    if (!password || password !== validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return true;
  }
}
