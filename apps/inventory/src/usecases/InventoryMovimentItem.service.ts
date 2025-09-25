import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { kafka } from 'src/core/config/kafka';
import { MovimentType } from 'generated/prisma';

import { PrismaItemRepository } from 'src/infra/prisma/repositories/PrismaItemRepository';
import { PrismaInventoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryRepository';
import { PrismaMovimentRepository } from 'src/infra/prisma/repositories/PrismaMovimentRepository';
import { PrismaInventoryTransactionHistoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryTransactionHistoryRepository';

@Injectable()
export class InventoryMovimentItemService {
  private consumer: Consumer;
  private producer: Producer;
  private readonly serviceTag = '[INVENTORY-MOVIMENT-SERVICE]';

  constructor(
    private readonly movimentRepository: PrismaMovimentRepository,
    private readonly itemRepository: PrismaItemRepository,
    private readonly inventoryRepository: PrismaInventoryRepository,
    private readonly transactionHistoryRepository: PrismaInventoryTransactionHistoryRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Producer connected`);

    this.consumer = kafka.consumer({
      groupId: 'inventory-moviment-item-group',
    });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'sent_inventory' });
    console.log(
      `${this.serviceTag} Consumer subscribed to topic: sent_inventory`,
    );

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const rawMessage = message.value?.toString();
          if (!rawMessage) {
            console.warn(`${this.serviceTag} Received empty message, skipping`);
            return;
          }

          const { productId, quantity, sagaId } = JSON.parse(rawMessage);

          console.log(
            `${this.serviceTag} Message received | sagaId: ${sagaId} | productId: ${productId} | quantity: ${quantity}`,
          );

          const item = await this.itemRepository.findById(String(productId));
          if (!item) {
            console.warn(
              `${this.serviceTag} Item not found | productId: ${productId}`,
            );
            throw new NotFoundException('Item does not exist');
          }

          const inventoryRecord = await this.inventoryRepository.findByItemId(
            String(productId),
          );
          if (!inventoryRecord) {
            console.warn(
              `${this.serviceTag} Item not found in inventory | productId: ${productId}`,
            );
            throw new NotFoundException('Item does not exist in inventory');
          }

          const updatedQuantity = inventoryRecord.quantity - quantity;
          if (updatedQuantity < 0) {
            console.warn(
              `${this.serviceTag} Insufficient stock | productId: ${productId} | requested: ${quantity} | available: ${inventoryRecord.quantity}`,
            );

            const sentErrorMessage = JSON.stringify({
              sagaId,
              service_name: 'inventory-moviment-item-service',
            });

            await this.producer.send({
              topic: 'micro-transaction-in-inventory-failed',
              messages: [{ value: sentErrorMessage }],
            });

            throw new ForbiddenException('Insufficient stock quantity');
          }

          await this.inventoryRepository.update({
            id: inventoryRecord.id!,
            itemId: inventoryRecord.itemId,
            quantity: updatedQuantity,
            updatedAt: new Date(),
          });
          console.log(
            `${this.serviceTag} Inventory updated | productId: ${productId} | newQuantity: ${updatedQuantity}`,
          );

          const moviment = await this.movimentRepository.create({
            inventoryId: inventoryRecord.id!,
            itemId: inventoryRecord.itemId,
            type: MovimentType.OUT,
            quantity,
          });
          console.log(
            `${this.serviceTag} Movement recorded | movimentId: ${moviment.id} | type: OUT | quantity: ${quantity}`,
          );

          const successMessage = JSON.stringify({
            id: moviment.id,
            sagaId,
            statusCode: 200,
            service_name: 'inventory-moviment-service',
          });

          await this.producer.send({
            topic: 'micro-transaction-in-inventory-success',
            messages: [{ value: successMessage }],
          });
          console.log(
            `${this.serviceTag} Success message published | topic: micro-transaction-in-inventory-success | sagaId: ${sagaId}`,
          );

          await this.transactionHistoryRepository.create({
            inventoryId: inventoryRecord.id!,
            item_name: item.name,
            itemId: item.id!,
            quantity,
            sagaId,
            typeMoviment: moviment.type,
          });
          console.log(
            `${this.serviceTag} Transaction history saved | sagaId: ${sagaId}`,
          );
        } catch (error) {
          console.error(
            `${this.serviceTag} Kafka message processing failed:`,
            error,
          );
        }
      },
    });
  }
}
