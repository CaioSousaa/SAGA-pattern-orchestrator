import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';
import { kafka } from 'src/core/config/kafka';

@Injectable()
export class UpdateClientBalanceService {
  private producer: Producer;
  private consumer: Consumer;

  constructor(private clientRepository: ClientPrismarRepository) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();

    this.consumer = kafka.consumer({ groupId: 'update-balance-group' });
    await this.consumer.connect();

    console.log('[BALANCE-SERVICE] Consumer connected successfully!');

    await this.consumer.subscribe({ topic: 'virtualization-balance-update' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value?.toString();
        const payload = rawMessage ? JSON.parse(rawMessage) : null;

        if (!payload) return;

        const { userId, newBalance, service, sagaId } = payload;

        console.log(
          `[BALANCE-SERVICE] Message received | Topic: ${topic} | Partition: ${partition} | Payload:`,
          payload,
        );

        try {
          if (!userId || newBalance === undefined) {
            console.warn(
              '[BALANCE-SERVICE] Invalid message: userId or newBalance is missing.',
            );
            return;
          }

          const updatedClient = await this.clientRepository.updateClient(
            String(userId),
            Number(newBalance),
          );

          console.log(
            `[BALANCE-SERVICE] Balance updated successfully for client ${userId}. New balance: ${newBalance}`,
          );
          console.log('[BALANCE-SERVICE] Updated client:', updatedClient);
        } catch (error) {
          console.error(
            '[BALANCE-SERVICE] Error processing Kafka message:',
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
            `[BALANCE-SERVICE] Failure message published to micro-order-failed | sagaId: ${sagaId}`,
          );
        }
      },
    });
  }
}
