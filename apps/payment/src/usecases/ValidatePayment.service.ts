import { BadRequestException, Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';
import { CustomerPrismarRepository } from 'src/infra/prisma/repositories/CustomerPrismaRepository';
import { kafka } from 'src/core/config/kafka';
import { PaymentPrismarRepository } from 'src/infra/prisma/repositories/PaymentPrismaRepository';

@Injectable()
export class ValidatePaymentService {
  private consumer: Consumer;
  private producer: Producer;

  constructor(
    private readonly customerRepo: CustomerPrismarRepository,
    private readonly paymentRepo: PaymentPrismarRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[PAYMENT PRODUCER CONNECTED]');

    this.consumer = kafka.consumer({ groupId: 'create-payment-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'sent_payment' });
    console.log('[PAYMENT CONSUMER CONNECTED]');

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) return;

          console.log(
            `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${rawValue}`,
          );

          const { total, sagaId, productId, userId, balance } =
            JSON.parse(rawValue);

          let customer = await this.customerRepo.findById(String(userId));

          if (!customer) {
            customer = await this.customerRepo.create({
              id: userId,
              balance,
            });
          }

          if (customer.balance < total) {
            throw new BadRequestException(
              'Insufficient balance to complete purchase',
            );
          }

          const payment = await this.paymentRepo.create({
            customerId: customer.id,
            productId,
          });

          const newBalance = customer.balance - Number(total);

          await this.customerRepo.update(customer.id, newBalance);

          await new Promise((resolve) => setTimeout(resolve, 3000));

          const eventMessage = JSON.stringify({
            sagaId,
            id: payment.id,
            statusCode: 200,
            service_name: 'payment_service',
            data: {
              newBalance,
              customerId: customer.id,
            },
          });

          await this.producer.send({
            topic: 'micro-payment-success',
            messages: [{ value: eventMessage }],
          });

          console.log(
            `[KAFKA MESSAGE SENT] ${eventMessage} -> topic: payment-success`,
          );
        } catch (error) {
          console.error(
            '[PAYMENT ERROR] Kafka message processing failed:',
            error,
          );
        }
      },
    });
  }
}
