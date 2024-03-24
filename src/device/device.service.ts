import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Device } from '@prisma/client';
import { CreateDeviceDTO} from './dtos/create-device.dto';
import { UpdateDeviceDTO } from './dtos/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async associateUserToDevice(userId: number, deviceId: number, isAdmin: boolean): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const device = await this.prisma.device.findUnique({ where: { device_id: deviceId } });
    if (!device) {
      throw new NotFoundException(`Device with id ${deviceId} not found`);
    }

    await this.prisma.user_Device.create({
      data: {
        user: { connect: { user_id: userId } },
        device: { connect: { device_id: deviceId } },
        is_admin: isAdmin // Set is_admin based on the parameter value
      }
    });
  }

  async create(createDeviceDto: CreateDeviceDTO): Promise<Device> {
    const {username, device_name, device_type, mac_address} = createDeviceDto;

    const existMac  = await this.prisma.device.findUnique({ where: { mac_address } });
    if (existMac) {
      throw new ConflictException(`Device MAC already exist`);
    }

    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException(`The user ${username} not found`);
    }
    const device= await  this.prisma.device.create({ data: {
      device_name,
      device_type,
      mac_address,
    } });
    
    if (!device) {
      throw new ConflictException(`The device can't be created`);
    }
    const user_device = await this.associateUserToDevice(user.user_id, device.device_id, true );
    return{
      device_id: device.device_id,
      device_name,
      device_type,
      mac_address,
      created_at: device.created_at,
    }
  }

  async readOne(device_id: number, user_id: number): Promise<Device> {
    const device = await this.prisma.device.findUnique({ where: { 
      device_id,
      users:{
        some:{
          user_id
        }
      }
     } });
    if (!device) {
      throw new NotFoundException(`Device with id ${device_id} not found`);
    }
    return device;
  }

  async readAll(user_id: number) {
    const user = await this.prisma.user.findUnique({where:{user_id}});
    if(!user){
      throw new NotFoundException(`User with id ${user_id} not found`)
    }
    const devices = await this.prisma.device.findMany({
      where: {
        users: {
          some: {
            user_id,
          },
        },
      },
    });
    return devices;
  }

   async update(device_id: number, user_id: number, updateDeviceDto: UpdateDeviceDTO): Promise<Device> {
    const device = await this.readOne(device_id, user_id);
    return this.prisma.device.update({ where: { device_id }, data: updateDeviceDto });
  }

  async updatePartial(device_id: number, user_id: number, updateDeviceDto: UpdateDeviceDTO): Promise<Device> {
    const device = await this.readOne(device_id, user_id);
    return this.prisma.device.update({ where: { device_id }, data: updateDeviceDto });
  }

  async delete(device_id: number, user_id: number): Promise<Device> {
    const device = await this.readOne(device_id, user_id);
    return this.prisma.device.delete({ where: { device_id } });
  }
}
