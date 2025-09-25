import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { kafka } from 'src/core/config/kafka';
import { OrderPrismaRepository } from 'src/infra/prisma/repositories/OrderPrismaRepository';

@Injectable()
export class CompensationOrderService {
  private producer: Producer;
  private consumer: Consumer;
  private readonly serviceTag = '[COMPENSATION-ORDER-SERVICE]';

  constructor(private readonly orderPrismaRepository: OrderPrismaRepository) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();

    this.consumer = kafka.consumer({ groupId: 'compensation-order-group' });
    await this.consumer.connect();

    console.log(`${this.serviceTag} Consumer connected successfully`);

    await this.consumer.subscribe({ topic: 'compensation-order-service' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value?.toString();
        const payload = rawMessage ? JSON.parse(rawMessage) : null;
        if (!payload) return;

        const { orderId, service_name } = payload;

        console.log(
          `${this.serviceTag} Message received | topic: ${topic} | partition: ${partition} | payload:`,
          payload,
        );

        try {
          const orderCompensated =
            await this.orderPrismaRepository.compensationOrder(String(orderId));

          console.log(
            `${this.serviceTag} Compensation executed successfully | orderId: ${orderId} | service: ${service_name}`,
          );
          console.log(
            `${this.serviceTag} Order compensated:`,
            orderCompensated,
          );
        } catch (error) {
          console.error(
            `${this.serviceTag} Error processing Kafka message:`,
            error,
          );

          await this.producer.send({
            topic: 'compensation-order-failed',
            messages: [
              {
                value: JSON.stringify({
                  service: 'compensation-order-service',
                  status: 400,
                  orderId,
                }),
              },
            ],
          });

          console.log(
            `${this.serviceTag} Failure message published | topic: compensation-order-failed | orderId: ${orderId}`,
          );
        }
      },
    });
  }
}
