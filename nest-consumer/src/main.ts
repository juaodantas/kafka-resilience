import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'poc-consumer',
        brokers: [process.env.KAFKA_BROKER],
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
