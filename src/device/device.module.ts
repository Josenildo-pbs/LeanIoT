import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [DeviceController],
  providers: [DeviceService, TokenService],
})
export class DeviceModule {}
