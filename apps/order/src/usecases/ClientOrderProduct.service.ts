import { Injectable } from '@nestjs/common';
import { kafka } from '../../core/config/kafka';
import { Consumer, Producer } from 'kafkajs';
import { OrderPrismarRepository } from 'src/infra/prisma/repositories/OrderPrismaRepository';
import { ProductPrismarRepository } from 'src/infra/prisma/repositories/ProductPrismaRepository';
import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';

@Injectable()
export class ClientOrderProductService {
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    private orderPrismarRepository: OrderPrismarRepository,
    private productPrismarRepository: ProductPrismarRepository,
    private clientPrismarRepository: ClientPrismarRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('ORDER PRODUCER CONNECTED');

    this.consumer = kafka.consumer({ groupId: 'create-order-group' });
    await this.consumer.connect();
    console.log('[ORDER CONSUMER CONNECTED]');
    await this.consumer.subscribe({ topic: 'initial-flow-saga' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value?.toString();

          const data = rawValue ? JSON.parse(rawValue) : null;

          if (!data) return;

          let {
            userId,
            name,
            email,
            balance,
            productId,
            name_product,
            price,
            quantity,
            sagaId,
          } = data;

          const clientExists = await this.clientPrismarRepository.findClient(
            String(userId),
          );

          if (!clientExists) {
            const newClient = await this.clientPrismarRepository.create({
              id: String(userId),
              balance: Number(balance),
              email: String(email),
              name: String(name),
            });

            userId = newClient.id;
            name = newClient.name;
            email = newClient.email;
            balance = newClient.balance;
          }

          const productExists = await this.productPrismarRepository.findById(
            String(productId),
          );

          if (!productExists) {
            const newProduct = await this.productPrismarRepository.create({
              id: String(productId),
              name: String(name_product),
              price: Number(price),
            });

            productId = newProduct.id;
            name_product = newProduct.name;
            price = newProduct.price;
          }

          const total = quantity * price;

          await this.orderPrismarRepository.create({
            clientId: userId,
            productId,
            quantity,
            total,
          });

          const sendMessage = JSON.stringify({
            userId,
            productId,
            total,
            balance,
            sagaId,
            quantity,
          });

          await this.producer.send({
            topic: 'micro-order',
            messages: [{ value: sendMessage }],
          });

          console.log(
            `[ORDER MICRO MESSAGE RECEIVED] Topic: ${topic} | Data:`,
            data,
          );

          console.log(`Message ${sendMessage} sent to topic micro-order`);

          console.log('[ORDER MICRO] Order saved successfully!');
        } catch (error) {
          console.error('[ORDER MICRO] Error processing Kafka message:', error);
        }
      },
    });
  }
}
