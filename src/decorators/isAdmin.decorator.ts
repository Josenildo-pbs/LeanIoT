import { SetMetadata } from '@nestjs/common';
export const IsAdmin = (access: Boolean) => SetMetadata('access', access);
