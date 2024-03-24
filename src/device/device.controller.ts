import {
    Controller,
    Body,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { IsAdmin } from 'src/decorators/isAdmin.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/isAdmin.guard';
import { CreateDeviceDTO} from './dtos/create-device.dto'
import { UpdateDeviceDTO } from './dtos/update-device.dto'

@Controller('device')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService,
    ){}
    
    @Post()
    async create(@Body() data: CreateDeviceDTO) {
      return this.deviceService.create(data);
    }
  
    @UseGuards(AuthGuard)
    @Get()
    async list(@Req() req) {
        const user_id = req.tokenPayload.id;
        return this.deviceService.readAll(user_id);
    }
    @UseGuards(AuthGuard)
    @Get(':id')
    async show(@Param('id', ParseIntPipe) device_id: number, @Req() req) {
        const user_id = req.tokenPayload.id;
        return this.deviceService.readOne(device_id, user_id);
    }
    @UseGuards(AuthGuard)
    @Put(':id')
    async update(
      @Param('id', ParseIntPipe) device_id: number,
      @Body() data: CreateDeviceDTO,
      @Req() req
    ) {
        const user_id = req.tokenPayload.id;
        return this.deviceService.update(device_id, user_id, data);
    }
    @UseGuards(AuthGuard)
    @Patch(':id')
    async updatePartial(
      @Param('id', ParseIntPipe) device_id: number,
      @Body() data: UpdateDeviceDTO,
      @Req() req
    ) {
        const user_id = req.tokenPayload.id;
        return this.deviceService.updatePartial(device_id,user_id, data);
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) device_id: number, @Req() req) {
        const user_id = req.tokenPayload.id;
        return this.deviceService.delete(device_id, user_id);
    }

}
