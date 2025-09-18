import { Injectable } from '@nestjs/common';
import { PrismaActionsRepository } from '../infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from '../infra/prisma/repositories/PrismaSagaRepository';
import { Consumer, Producer } from 'kafkajs';
import { kafka } from 'src/config/kafka';
import { SagaTopics } from '../domain/enums/TopicsEnum';
import { Status } from 'generated/prisma';

@Injectable()
export class ConfirmOrderService {
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    private readonly prismaActionsRepository: PrismaActionsRepository,
    private readonly prismaSagaRepository: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[KAFKA-CONFIRM-ORDER PRODUCER CONNECTED]');

    this.consumer = kafka.consumer({ groupId: 'confirm-order-group' });
    await this.consumer.subscribe({ topic: SagaTopics.ORDER });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${message.value?.toString()}`,
        );

        try {
          const rawValue = message.value?.toString();

          const data = rawValue ? JSON.parse(rawValue) : null;

          if (!data) return;

          const { userId, sagaId, balance, productId, total, quantity } = data;

          await this.prismaSagaRepository.update(
            String(sagaId),
            Status.IN_PROGRESS,
          );
          await this.prismaActionsRepository.create({
            name_action: 'confirm_order',
            saga_id: sagaId,
          });

          const payment_message = JSON.stringify({
            userId,
            balance,
            total,
            sagaId,
            productId,
          });

          this.producer.send({
            topic: 'sent_payment',
            messages: [{ value: payment_message }],
          });

          console.log(`Message ${payment_message} sent to topic sent_payment`);

          const inventory_message = JSON.stringify({
            productId,
            quantity,
            sagaId,
          });

          this.producer.send({
            topic: 'sent_inventory',
            messages: [{ value: inventory_message }],
          });

          console.log(
            `Message ${inventory_message} sent to topic sent_inventory`,
          );
        } catch (error) {
          console.error('[SEC MICRO] Error processing Kafka message:', error);
        }
      },
    });
  }
}
