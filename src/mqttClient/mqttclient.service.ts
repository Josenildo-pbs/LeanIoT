import { Injectable, Inject ,NotFoundException} from '@nestjs/common';
import {ClientMqtt} from '@nestjs/microservices'
import { PrismaService } from 'src/prisma/prisma.service';
import { MqttResponseGateway } from "../gateways/mqttresponse.gateway";


@Injectable()
export class MqttClientService {
    constructor(
        @Inject('MQTT_SERVICE') private client : ClientMqtt,
        private readonly  prisma: PrismaService,
        private readonly wsocket: MqttResponseGateway
    ){}

    async sendSocket(macAddress: string, message: string){
        const device = await this.prisma.device.findUnique({
            where: {
              mac_address: macAddress,
            },
          });
          const event =  `${device.device_id}:${macAddress}`
          console.log(event)
          this.wsocket.sendEventMessage(event, message);
          await  this.prisma.deviceMessage.create({
            data:{
                device_id:device.device_id,
                message
            }
        })
    }
    async send(user_id: number, device_id: number, message: string){
        const user =  await this.prisma.user.findUnique({where:{user_id}})
        if (!user) {
            throw new NotFoundException(`User with id ${user_id} not found`);
        }
        const device =  await this.prisma.device.findUnique({where:{device_id,}})
        if (!device) {
            throw new NotFoundException(`Device with id ${user_id} not found`);
        }
        const userDevice = await this.prisma.user_Device.findUnique({
            where: {
              user_id_device_id: {
                user_id,
                device_id
              },
            },
          });

          if (!userDevice) {
            throw new NotFoundException(`Device with id ${device_id} does not belong to the user with id ${user_id}`);
        }
        const userMsg = await  this.prisma.userMessage.create({
            data:{
                user_id,
                device_id,
                message
            }
        })
        const topic =  `/device/${device.mac_address}`
        this.client.emit(topic, message)
        return  {
            topic: topic,
            message:userMsg
        }
    }
  
}
