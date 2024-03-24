// create-device.dto.ts
import { IsString, IsMACAddress} from 'class-validator';

export class CreateDeviceDTO {
  @IsString()
  username: string;

  @IsString()
  device_name: string;

  @IsString()
  mac_address: string;

  @IsString()
  device_type: string;
}
