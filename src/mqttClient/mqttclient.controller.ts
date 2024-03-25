import { Controller, Get, Body , UseGuards, Req, Param, ParseIntPipe} from '@nestjs/common';
import {MessagePattern, Payload, Ctx, MqttContext} from '@nestjs/microservices'
import {MqttClientService} from './mqttclient.service'
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('broker')
export class MqttClientController {
    constructor(
        private readonly mqtt: MqttClientService,
        ) {}

    @UseGuards(AuthGuard)
    @Get('send/:id')
    async sendMessage(@Body() data: { message: string }, @Req() req, @Param('id', ParseIntPipe) device_id: number) {
        const user_id =  req.tokenPayload.id
        return  this.mqtt.send(user_id, device_id, data.message)
  }

    @MessagePattern('/devices/#')
    getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
        console.log(`Received data: ${data}`);
        console.log(`Topic: ${context.getTopic()}`);
        const topic = context.getTopic();
        const element = topic.split('/');
        const macAddress =  element[element.length-1]
        this.mqtt. sendSocket(macAddress, data.toString())
    // Add your message handling logic here
    }
}
