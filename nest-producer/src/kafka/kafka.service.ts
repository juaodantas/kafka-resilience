import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin, Kafka } from 'kafkajs';
import { KafkaTopics } from './configs/kafka_topic_list';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private readonly logger = new Logger(KafkaService.name);
  @Inject('TEST_SERVICE') private kafkaService: ClientKafka;

  /**
   * Creates an instance of KafkaService.
   */
  public constructor() {
    this.kafka = new Kafka({
      clientId: 'poc-producer',
      brokers: [process.env.KAFKA_BROKER],
    });

    this.admin = this.kafka.admin();
  }

  /**
   * Function that creates Kafka topics
   * @param {string[]} topics - Topics to be created
   */
  public async createTopics(topics: string[]): Promise<void> {
    await this.admin.connect();
    const kafkaExistentTopics: string[] = await this.admin.listTopics();
    const topicToCreate: string[] = topics.filter((topic) => !kafkaExistentTopics.includes(topic));
    if (topicToCreate.length > 0) {
      await this.admin.createTopics({
        topics: topicToCreate.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      this.logger.log({ message: 'Tópicos Kafka Criados: ', topicToCreate });
    } else {
      this.logger.log('Os Tópicos Kafka já existem !!');
    }
    await this.admin.disconnect();
  }

  public startSendingRandomNumbers(): void {
    this.logger.log('Enviando...');
    setInterval(() => this.sendToKafkaTopic(), 5000);
  }

  /**
 * Método para enviar informações via Kafka
 */
  private sendToKafkaTopic(): void {
      try {
          const randomNumber: number = Math.floor(Math.random() * 100); // Gera um número randômico entre 0 e 99
          this.kafkaService.emit(KafkaTopics.TEST_TOPIC, randomNumber);
          console.log('Enviando mensagem para o Kafka:', randomNumber);
      } catch (error) {
          console.error('Error sending message to Kafka:', error);
      }
  }
}
