import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { kafka } from 'src/core/config/kafka';
import { PrismaInventoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryRepository';
import { PrismaInventoryTransactionHistoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryTransactionHistoryRepository';

@Injectable()
export class CompensationInventoryService {
  private producer: Producer;
  private consumer: Consumer;
  private readonly serviceTag = '[COMPENSATION-INVENTORY-SERVICE]';

  constructor(
    private readonly transactionHistoryRepository: PrismaInventoryTransactionHistoryRepository,
    private readonly inventoryRepository: PrismaInventoryRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();

    this.consumer = kafka.consumer({ groupId: 'compensation-inventory-group' });
    await this.consumer.connect();

    console.log(`${this.serviceTag} Consumer connected successfully!`);

    await this.consumer.subscribe({ topic: 'compensation-inventory-service' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value?.toString();
        const payload = rawMessage ? JSON.parse(rawMessage) : null;

        if (!payload) return;

        const { sagaId } = payload;

        console.log(
          `${this.serviceTag} Message received | Topic: ${topic} | Partition: ${partition} | Payload:`,
          payload,
        );

        try {
          const transaction =
            await this.transactionHistoryRepository.findBySagaId(
              String(sagaId),
            );

          if (!transaction) {
            console.warn(
              `${this.serviceTag} No transaction found for sagaId: ${sagaId}`,
            );
            return;
          }

          const inventoryItem = await this.inventoryRepository.findByItemId(
            String(transaction.itemId),
          );

          if (!inventoryItem) {
            console.warn(
              `${this.serviceTag} No inventory item found for itemId: ${transaction.itemId}`,
            );
            return;
          }

          if (transaction.typeMoviment === 'OUT') {
            const updatedQuantity =
              inventoryItem.quantity + transaction.quantity;

            await this.inventoryRepository.update({
              id: transaction.inventoryId,
              itemId: transaction.itemId,
              quantity: updatedQuantity,
              updatedAt: new Date(),
            });
          }

          console.log(
            `${this.serviceTag} Compensation applied successfully for sagaId: ${sagaId}`,
          );
        } catch (error) {
          console.error(
            `${this.serviceTag} Error processing Kafka message:`,
            error,
          );

          await this.producer.send({
            topic: 'compensation-inventory-failed',
            messages: [
              {
                value: JSON.stringify({
                  service: 'compensation-inventory-service',
                  status: 400,
                  sagaId,
                }),
              },
            ],
          });

          console.log(
            `${this.serviceTag} Failure message published to compensation-inventory-failed | sagaId: ${sagaId}`,
          );
        }
      },
    });
  }
}
