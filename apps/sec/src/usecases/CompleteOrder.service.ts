import { Injectable } from '@nestjs/common';
import { Status } from 'generated/prisma';
import { Consumer, Producer } from 'kafkajs';
import { kafka } from 'src/core/config/kafka';
import { SagaTopicsSubscribe } from 'src/core/domain/enums/TopicsEnum';
import { PrismaActionsRepository } from 'src/infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from 'src/infra/prisma/repositories/PrismaSagaRepository';

@Injectable()
export class CompleteOrder {
  consumer: Consumer;
  producer: Producer;

  constructor(
    private prismaActionsRepository: PrismaActionsRepository,
    private prismaSagaRepository: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[KAFKA-COMPLETE-ORDER PRODUCER CONNECTED]');

    this.consumer = kafka.consumer({ groupId: 'complete-order-group' });
    await this.consumer.subscribe({
      topics: [
        SagaTopicsSubscribe.PAYMENT_SUCCESS,
        SagaTopicsSubscribe.INVENTORY_SUCCESS,
      ],
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${message.value?.toString()}`,
        );

        const rawValue = message.value?.toString();

        const data = rawValue ? JSON.parse(rawValue) : null;

        if (!data) return;

        const {
          sagaId,
          id,
          service_name,
          statusCode,
          data: innerData = {},
        } = data;

        const userId = innerData.customerId
          ? String(innerData.customerId)
          : null;
        const newBalance = innerData.newBalance
          ? Number(innerData.newBalance)
          : null;

        try {
          if (service_name === 'payment_service') {
            //VBU = virtualization-balance-update
            const sentMessageForTopicVBU = JSON.stringify({
              userId,
              newBalance,
              service: 'orchestrator: CompleteOrderService',
              sagaId,
            });

            await this.producer.send({
              topic: 'virtualization-balance-update',
              messages: [{ value: sentMessageForTopicVBU }],
            });

            await this.prismaActionsRepository.create({
              name_action: 'sent: virtualization-balance-update',
              saga_id: sagaId,
            });
          }

          await this.prismaActionsRepository.create({
            name_action: `recevid: ${service_name}`,
            saga_id: sagaId,
          });

          await this.prismaSagaRepository.update(
            String(sagaId),
            Status.COMPLETED,
          );

          const hasActionsInSaga =
            await this.prismaSagaRepository.hasActions(sagaId);

          if (hasActionsInSaga) {
            console.log('SAGA COMPLETED');
          }
        } catch (error) {
          console.error(
            '[SEC MICRO - COMPLETE_ORDER] Error processing Kafka message:',
            error,
          );
        }
      },
    });
  }
}
