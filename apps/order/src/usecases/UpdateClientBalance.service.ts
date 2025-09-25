import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';
import { kafka } from 'src/core/config/kafka';

@Injectable()
export class UpdateClientBalanceService {
  private producer: Producer;
  private consumer: Consumer;
  private readonly serviceTag = '[BALANCE-SERVICE]';

  constructor(private readonly clientRepository: ClientPrismarRepository) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();

    this.consumer = kafka.consumer({ groupId: 'update-balance-group' });
    await this.consumer.connect();

    console.log(`${this.serviceTag} Consumer connected successfully`);

    await this.consumer.subscribe({ topic: 'virtualization-balance-update' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value?.toString();
        const payload = rawMessage ? JSON.parse(rawMessage) : null;
        if (!payload) return;

        const { userId, newBalance, service, sagaId } = payload;

        console.log(
          `${this.serviceTag} Message received | topic: ${topic} | partition: ${partition} | payload:`,
          payload,
        );

        try {
          if (!userId || newBalance === undefined) {
            console.warn(
              `${this.serviceTag} Invalid message: userId or newBalance is missing`,
            );
            return;
          }

          const updatedClient = await this.clientRepository.updateClient(
            String(userId),
            Number(newBalance),
          );

          console.log(
            `${this.serviceTag} Balance updated successfully | clientId: ${userId} | newBalance: ${newBalance}`,
          );
          console.log(`${this.serviceTag} Updated client:`, updatedClient);
        } catch (error) {
          console.error(
            `${this.serviceTag} Error processing Kafka message:`,
            error,
          );

          await this.producer.send({
            topic: 'micro-order-failed',
            messages: [
              {
                value: JSON.stringify({
                  sagaId,
                  service: 'order-service',
                  status: 400,
                }),
              },
            ],
          });

          console.log(
            `${this.serviceTag} Failure message published | topic: micro-order-failed | sagaId: ${sagaId}`,
          );
        }
      },
    });
  }
}
