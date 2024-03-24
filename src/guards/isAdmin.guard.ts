import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  
  async canActivate(context: ExecutionContext) {
    const accessControl = this.reflector.getAllAndOverride('access', [
      context.getHandler(),
      context.getClass(),
    ]);
    const { tokenPayload } = context.switchToHttp().getRequest();
    if (!accessControl) {
      return true;
    }
    if (tokenPayload.is_admin == accessControl) {
      return true;
    } else {
      return false;
    }
  }
}
