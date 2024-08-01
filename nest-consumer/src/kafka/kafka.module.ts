import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_ENV } from './configs/kafka_topic_list';
import { KafkaController } from './kafka.controller';
import { RetryService } from './retry.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'poc-consumer',
            brokers: [KAFKA_ENV],
          },
        },
      },
    ]),
  ],
  providers: [KafkaService, RetryService],
  exports: [ClientsModule],
  controllers: [KafkaController],
})
export class KafkaModule {}
