import { Injectable } from '@nestjs/common';
import { Status } from 'generated/prisma';
import { Consumer, Producer } from 'kafkajs';
import { kafka } from 'src/core/config/kafka';
import { SagaTopicsSubscribe } from 'src/core/domain/enums/TopicsEnum';
import { PrismaActionsRepository } from 'src/infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from 'src/infra/prisma/repositories/PrismaSagaRepository';

@Injectable()
export class CompleteOrder {
  private consumer: Consumer;
  private producer: Producer;
  private readonly serviceTag = '[COMPLETE-ORDER-SERVICE]';

  constructor(
    private readonly actionsRepo: PrismaActionsRepository,
    private readonly sagaRepo: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Producer connected`);

    this.consumer = kafka.consumer({ groupId: 'complete-order-group' });
    await this.consumer.subscribe({
      topics: [
        SagaTopicsSubscribe.PAYMENT_SUCCESS,
        SagaTopicsSubscribe.INVENTORY_SUCCESS,
        SagaTopicsSubscribe.PAYMENT_FAILED,
        SagaTopicsSubscribe.INVENTORY_FAILED,
      ],
    });
    console.log(`${this.serviceTag} Consumer subscribed to topics`);

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `${this.serviceTag} Message received | topic: ${topic} | partition: ${partition} | value: ${message.value?.toString()}`,
        );

        const rawValue = message.value?.toString();
        const data = rawValue ? JSON.parse(rawValue) : null;
        if (!data) {
          console.log(`${this.serviceTag} Empty or invalid message`);
          return;
        }

        const {
          sagaId,
          service_name,
          statusCode,
          customerId,
          newBalance,
          orderId,
        } = data;

        try {
          if (topic === SagaTopicsSubscribe.PAYMENT_FAILED) {
            console.log(
              `${this.serviceTag} Payment failed detected | orderId: ${orderId}`,
            );

            const compensationOrderMessage = JSON.stringify({
              orderId,
              service_name: 'complete-order-service',
            });

            await this.producer.send({
              topic: 'compensation-order-service',
              messages: [{ value: compensationOrderMessage }],
            });

            const compensationInventoryMessage = JSON.stringify({
              sagaId,
              service_name: 'complete-order-service',
            });

            await this.producer.send({
              topic: 'compensation-inventory-service',
              messages: [{ value: compensationInventoryMessage }],
            });

            console.log(
              `${this.serviceTag} Sent messages to compensation-order-service and compensation-inventory-service`,
            );

            await this.actionsRepo.create({
              name_action: 'sent: compensation-order-service',
              saga_id: sagaId,
            });

            await this.actionsRepo.create({
              name_action: 'sent: compensation-inventory-service',
              saga_id: sagaId,
            });

            await this.sagaRepo.update(sagaId, Status.ACTION_COMPENSATORY);

            throw new Error(
              'An error occurred related to payment, please try again',
            );
          }

          if (topic === SagaTopicsSubscribe.INVENTORY_FAILED) {
            await new Promise((resolve) => setTimeout(resolve, 5000));

            console.log(
              `${this.serviceTag} Stock logistics error detected | service: ${service_name}`,
            );

            const compensationOrderMessage = JSON.stringify({
              orderId,
              service_name: 'complete-order-service',
            });

            await this.producer.send({
              topic: 'compensation-order-service',
              messages: [{ value: compensationOrderMessage }],
            });

            console.log(
              `[COMPLETE-ORDER-SERVICE] Sending compensation message to the topic ${topic}`,
              JSON.parse(compensationOrderMessage),
            );

            const compensationPaymentMessage = JSON.stringify({
              sagaId,
              service_name: 'complete-order-service',
            });

            await this.producer.send({
              topic: 'compensation-payment-service',
              messages: [{ value: compensationPaymentMessage }],
            });

            console.log(
              `${this.serviceTag} Sent messages to compensation-payment-service and compensation-inventory-service`,
            );

            await this.actionsRepo.create({
              name_action: 'sent: compensation-order-service',
              saga_id: sagaId,
            });

            await this.actionsRepo.create({
              name_action: 'sent: compensation-payment-service',
              saga_id: sagaId,
            });

            await this.sagaRepo.update(sagaId, Status.ACTION_COMPENSATORY);

            throw new Error(
              'An error occurred related to inventory, please try again',
            );
          }

          if (service_name === 'payment_service') {
            console.log(
              `${this.serviceTag} Processing payment_service | userId: ${customerId} | newBalance: ${newBalance}`,
            );

            const virtualizationMessage = JSON.stringify({
              userId: customerId,
              newBalance,
              service: 'orchestrator: CompleteOrderService',
              sagaId,
            });

            await this.producer.send({
              topic: 'virtualization-balance-update',
              messages: [{ value: virtualizationMessage }],
            });

            console.log(
              `${this.serviceTag} Sent message to virtualization-balance-update`,
            );

            await this.actionsRepo.create({
              name_action: 'sent: virtualization-balance-update',
              saga_id: sagaId,
            });
          }

          await this.actionsRepo.create({
            name_action: `received: ${service_name}`,
            saga_id: sagaId,
          });
          console.log(
            `${this.serviceTag} Action saved: received: ${service_name}`,
          );

          const hasActionsInSaga = await this.sagaRepo.hasActions(sagaId);
          if (hasActionsInSaga) {
            console.log(`${this.serviceTag} Saga ${sagaId} COMPLETED`);
            await this.sagaRepo.update(String(sagaId), Status.COMPLETED);
          }
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
