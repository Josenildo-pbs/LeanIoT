import { Controller, Post, Body , UseGuards, Inject} from '@nestjs/common';
import {MessagePattern, Payload, Ctx, MqttContext, ClientMqtt} from '@nestjs/microservices'
import {MqttClientService} from './mqttclient.service'
import { AuthGuard } from 'src/guards/auth.guard';
import { emit } from 'process';

@Controller('broker')
export class MqttClientController {
    constructor(
        private readonly mqttClientService: MqttClientService,
        @Inject('MQTT_SERVICE') private client : ClientMqtt,
        ) {}

    @UseGuards(AuthGuard)
    @Post('send')
    async sendMessage(@Body() data: { topic: string, message: string }) {
        return  this.client.emit(data.topic, data.message)
  }

    @MessagePattern('/devices')
    getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
        console.log(`Received data: ${data}`);
        console.log(`Topic: ${context.getTopic()}`);
    // Add your message handling logic here
    }
}
