import { Injectable } from '@nestjs/common';
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
  private readonly serviceTag = '[CONFIRM-ORDER-SERVICE]';

  constructor(
    private readonly actionsRepo: PrismaActionsRepository,
    private readonly sagaRepo: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Producer connected`);

    this.consumer = kafka.consumer({ groupId: 'confirm-order-group' });
    await this.consumer.subscribe({
      topics: [SagaTopicsSubscribe.ORDER, SagaTopicsSubscribe.ORDER_FAILED],
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(
          `${this.serviceTag} Message received | topic: ${topic} | value: ${message.value?.toString()}`,
        );

        const rawValue = message.value?.toString();
        const data = rawValue ? JSON.parse(rawValue) : null;
        if (!data) return;

        const {
          userId,
          sagaId,
          balance,
          productId,
          total,
          quantity,
          orderId,
          statusCode,
        } = data;

        try {
          if (statusCode === 400) {
            await this.sagaRepo.update(String(sagaId), Status.FAILED);
            throw new Error('Order error, please try again');
          }

          await this.actionsRepo.create({
            name_action: 'received: confirm_order',
            saga_id: sagaId,
          });

          const paymentMessage = JSON.stringify({
            userId,
            balance,
            total,
            sagaId,
            productId,
            orderId,
          });

          await this.producer.send({
            topic: SagaTopicsSent.SENT_PAYMENT_SUCCESS,
            messages: [{ value: paymentMessage }],
          });

          console.log(
            `${this.serviceTag} Message sent | topic: sent_payment | value: ${paymentMessage}`,
          );

          const inventoryMessage = JSON.stringify({
            productId,
            quantity,
            sagaId,
            orderId,
          });

          await this.producer.send({
            topic: SagaTopicsSent.SENT_INVENTORY_SUCCESS,
            messages: [{ value: inventoryMessage }],
          });

          console.log(
            `${this.serviceTag} Message sent | topic: sent_inventory | value: ${inventoryMessage}`,
          );

          await this.actionsRepo.create({
            name_action: 'sent: message_for_inventory',
            saga_id: sagaId,
          });

          await this.actionsRepo.create({
            name_action: 'sent: message_for_payment',
            saga_id: sagaId,
          });
        } catch (error) {
          console.error(
            `${this.serviceTag} Error processing Kafka message:`,
            error,
          );
        }
      },
    });
  }
}
