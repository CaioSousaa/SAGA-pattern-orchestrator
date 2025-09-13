import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { SagaTopics } from '../saga/domain/enums/TopicsEnum';

@Injectable()
export class KafkaConfigService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'saga-create-order',
    brokers: ['localhost:9092'],
  });

  private producer: Producer;
  private consumer: Consumer;

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    console.log('[KAFKA PRODUCER CONNECTED]');

    this.consumer = this.kafka.consumer({ groupId: 'saga-create-order-group' });
    await this.consumer.connect();
    console.log('[KAFKA CONSUMER CONNECTED]');

    await this.consumer.subscribe({ topic: SagaTopics.ORDER });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${message.value?.toString()}`,
        );
      },
    });
  }

  public async sendMessage(message: string, topic: SagaTopics) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });

    console.log(`Message ${message} sent to topic ${topic}`);
  }
}
