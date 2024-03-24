// update-device.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreateDeviceDTO} from '../dtos/create-device.dto'
export class UpdateDeviceDTO extends PartialType(CreateDeviceDTO) {
  @IsOptional()
  @IsString()
  device_name?: string;

  @IsOptional()
  @IsString()
  mac_address?: string;

  @IsOptional()
  @IsString()
  device_type?: string;
}
