export enum KafkaTopics {
  TEST_TOPIC = 'test.topic',
  DEAD_LEADER = 'dead.leader',
}

export const KAFKA_ENV: string = process.env.KAFKA_BROKER;
