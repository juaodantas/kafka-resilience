import { Controller, Inject } from '@nestjs/common';
import {  ClientKafka, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { KafkaTopics } from './configs/kafka_topic_list';
import { RetryService } from './retry.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly retryService: RetryService,
    @Inject('TEST_SERVICE') private kafkaService: ClientKafka
  ) {}

  @MessagePattern(KafkaTopics.TEST_TOPIC, Transport.KAFKA)
  public async messageReceiver(@Payload() message: any): Promise<void> {
    try {
        await this.retryService.retry(() => this.processMessage(message), 1, 1000);
    } catch (error) {
      console.error(`Error processing message`);
      await this.sendToDLQ(message);
    }
  }

  private async processMessage(message: any): Promise<void> {
    console.log('Message received: ', message);
    // Simular falha aleatória para testes
    if (Math.random() > 0.5) {
      throw new Error('Random failure');
    }
    // Processamento da mensagem
  }

  private async sendToDLQ(message: any): Promise<void> {
    try {
      this.kafkaService.emit(KafkaTopics.DEAD_LEADER, JSON.stringify(message));
      console.log('Message sent to DLQ:', message);
    } catch (error) {
      console.error(`Failed to send message to DLQ: ${error.message}`);
    }
  }
}
