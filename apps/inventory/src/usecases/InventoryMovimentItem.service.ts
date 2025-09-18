import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaItemRepository } from 'src/infra/prisma/repositories/PrismaItemRepository';
import { PrismaInventoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryRepository';
import { Consumer, Producer } from 'kafkajs';
import { kafka } from 'src/core/config/kafka';
import { MovimentType } from 'generated/prisma';
import { PrismaMovimentRepository } from 'src/infra/prisma/repositories/PrismaMovimentRepository';

@Injectable()
export class InventoryMovimentItemService {
  private consumer: Consumer;
  private producer: Producer;

  constructor(
    private readonly movimentRepo: PrismaMovimentRepository,
    private readonly itemRepo: PrismaItemRepository,
    private readonly inventoryRepo: PrismaInventoryRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[INVENTORY PRODUCER CONNECTED]');

    this.consumer = kafka.consumer({
      groupId: 'inventory-moviment-item-group',
    });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'sent_inventory' });
    console.log('[INVENTORY CONSUMER CONNECTED]');

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) return;

          const { productId, quantity, sagaId } = JSON.parse(rawValue);

          const item = await this.itemRepo.findById(String(productId));
          if (!item) throw new NotFoundException('Item does not exist');

          const inventoryItem = await this.inventoryRepo.findByItemId(
            String(productId),
          );
          if (!inventoryItem)
            throw new NotFoundException('Item does not exist in inventory');

          const updatedQuantity = inventoryItem.quantity - quantity;
          if (updatedQuantity < 0) {
            throw new ForbiddenException('Insufficient stock quantity');
          }

          await this.inventoryRepo.update({
            id: inventoryItem.id!,
            itemId: inventoryItem.itemId,
            quantity: updatedQuantity,
            updatedAt: new Date(),
          });

          const newMoviment = await this.movimentRepo.create({
            inventoryId: inventoryItem.id!,
            itemId: inventoryItem.itemId,
            type: MovimentType.OUT,
          });

          const sentMessage = JSON.stringify({
            movimentId: newMoviment.id,
            sagaId,
            status: 200,
          });

          await this.producer.send({
            topic: 'sucess-transation-in-inventory',
            messages: [{ value: sentMessage }],
          });

          console.log(
            `Message ${sentMessage} sent to topic sucess-transation-in-inventory`,
          );
        } catch (error) {
          console.error(
            '[INVENTORY ERROR] Kafka message processing failed:',
            error,
          );
        }
      },
    });
  }
}
