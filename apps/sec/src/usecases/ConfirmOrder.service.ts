import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaActionsRepository } from '../infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from '../infra/prisma/repositories/PrismaSagaRepository';
import { Consumer, Producer } from 'kafkajs';
import { kafka } from 'src/core/config/kafka';
import { Status } from 'generated/prisma';
import {
  SagaTopicsSent,
  SagaTopicsSubscribe,
} from 'src/core/domain/enums/TopicsEnum';

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
    await this.consumer.subscribe({
      topics: [SagaTopicsSubscribe.ORDER, SagaTopicsSubscribe.ORDER_FAILED],
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${message.value?.toString()}`,
        );

        const rawValue = message.value?.toString();

        const data = rawValue ? JSON.parse(rawValue) : null;

        if (!data) return;

        const { userId, sagaId, balance, productId, total, quantity, status } =
          data;

        try {
          if (status === 400) {
            await this.prismaSagaRepository.update(
              String(sagaId),
              Status.FAILED,
            );

            console.error('order error, please try again');
            return;
          }

          await this.prismaSagaRepository.update(
            String(sagaId),
            Status.IN_PROGRESS,
          );

          await this.prismaActionsRepository.create({
            name_action: 'recevid: confirm_order',
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
            topic: SagaTopicsSent.SENT_PAYMENT_SUCCESS,
            messages: [{ value: payment_message }],
          });

          console.log(`Message ${payment_message} sent to topic sent_payment`);

          const inventory_message = JSON.stringify({
            productId,
            quantity,
            sagaId,
          });

          this.producer.send({
            topic: SagaTopicsSent.SENT_INVENTORY_SUCCESS,
            messages: [{ value: inventory_message }],
          });

          console.log(
            `Message ${inventory_message} sent to topic sent_inventory`,
          );

          await this.prismaActionsRepository.create({
            name_action: 'sent: message_for_inventory',
            saga_id: sagaId,
          });
          await this.prismaActionsRepository.create({
            name_action: 'sent: message_for_payment',
            saga_id: sagaId,
          });
        } catch (error) {
          console.error(
            '[SEC MICRO - CONFIRM_ODER] Error processing Kafka message:',
            error,
          );
        }
      },
    });
  }
}
