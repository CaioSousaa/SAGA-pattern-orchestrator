import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';
import { ProductPrismarRepository } from 'src/infra/prisma/repositories/ProductPrismaRepository';
import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';
import { kafka } from 'src/core/config/kafka';
import { OrderPrismaRepository } from 'src/infra/prisma/repositories/OrderPrismaRepository';

@Injectable()
export class ClientOrderProductService {
  private producer: Producer;
  private consumer: Consumer;
  private readonly serviceTag = '[CLIENT-ORDER-PRODUCT-SERVICE]';

  constructor(
    private readonly orderPrismarRepository: OrderPrismaRepository,
    private readonly productPrismarRepository: ProductPrismarRepository,
    private readonly clientPrismarRepository: ClientPrismarRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Producer connected`);

    this.consumer = kafka.consumer({ groupId: 'create-order-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'initial-flow-saga' });
    console.log(
      `${this.serviceTag} Consumer subscribed to topic: initial-flow-saga`,
    );

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
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

        try {
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
          const order = await this.orderPrismarRepository.create({
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
            statusCode: 200,
            orderId: order.id,
            service: 'client-order-product-service',
          });

          await this.producer.send({
            topic: 'micro-order-success',
            messages: [{ value: sendMessage }],
          });

          console.log(
            `${this.serviceTag} Message received | topic: ${topic} | partition: ${partition} | data:`,
            data,
          );
          console.log(
            `${this.serviceTag} Success message published | topic: micro-order-success | sagaId: ${sagaId}`,
          );
          console.log(`${this.serviceTag} Order saved successfully`);
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
                  statusCode: 400,
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
