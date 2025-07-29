import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS and global validation pipe
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Create the MQTT microservice
  const mqttMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
        url: process.env.MQTT_URL || 'mqtt://localhost:1883',
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        reconnectPeriod: 1000,
    },
  });

  // Start the microservice
  await mqttMicroservice.listen();
  await app.listen(3000);
}
bootstrap();
