
import { Module } from '@nestjs/common';
import { MqttClientService } from './mqttclient.service'; 
import { MqttClientController } from './mqttclient.controller';
import {Transport, ClientsModule} from '@nestjs/microservices'
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [ClientsModule.register([
        {
          name: 'MQTT_SERVICE',
          transport: Transport.MQTT,
          options: {
            clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
            clean: true,
            connectTimeout: 4000,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            reconnectPeriod: 1000,
          },
        },
      ]),TokenModule],
    controllers: [MqttClientController],
    providers: [MqttClientService,TokenService ],
})
export class MqttClientModule {}
