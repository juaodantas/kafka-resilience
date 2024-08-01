import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_ENV, KafkaTopics } from './configs/kafka_topic_list';
import { KafkaService } from './kafka.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'poc-producer',
            brokers: [KAFKA_ENV],
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [ClientsModule],
})
export class KafkaModule implements OnModuleInit {
  private readonly logger = new Logger(KafkaModule.name);

  /**
   * Creates an instance of KafkaModule.
   * @param {KafkaService} kafkaService - Kafka service
   */
  public constructor(private readonly kafkaService: KafkaService) {}
  /**
   * Criação de todos os topicos
   */
  public async onModuleInit(): Promise<void> {
    const topicsToCreate: KafkaTopics[] = [
      KafkaTopics.TEST_TOPIC,
      KafkaTopics.DEAD_LEADER,
    ];
    try {
      await this.kafkaService.createTopics(topicsToCreate);
      this.logger.log('Conexões Kafka Disponiveis!');
    } catch (error) {
      this.logger.log({ message: 'Erro ao criar tópicos:', error });
    }
    this.kafkaService.startSendingRandomNumbers();
  }
}
