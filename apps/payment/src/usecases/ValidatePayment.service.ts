import { BadRequestException, Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';
import { CustomerPrismarRepository } from 'src/infra/prisma/repositories/CustomerPrismaRepository';
import { kafka } from 'src/core/config/kafka';
import { PaymentPrismarRepository } from 'src/infra/prisma/repositories/PaymentPrismaRepository';
import { CustomerPaymentHistoryPrismaRepository } from 'src/infra/prisma/repositories/CustomerPaymentHistoryPrismaRepository';

@Injectable()
export class ValidatePaymentService {
  private consumer: Consumer;
  private producer: Producer;
  private readonly serviceTag = '[PAYMENT-SERVICE]';

  constructor(
    private readonly customerRepo: CustomerPrismarRepository,
    private readonly paymentRepo: PaymentPrismarRepository,
    private readonly customerPaymentHistoryPrismaRepo: CustomerPaymentHistoryPrismaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Producer connected`);

    this.consumer = kafka.consumer({ groupId: 'create-payment-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'sent_payment' });
    console.log(`${this.serviceTag} Consumer connected`);

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) return;

          console.log(
            `${this.serviceTag} Message received | topic: ${topic} | value: ${rawValue}`,
          );

          const { total, sagaId, productId, userId, balance, orderId } =
            JSON.parse(rawValue);

          let customer = await this.customerRepo.findById(String(userId));
          if (!customer) {
            customer = await this.customerRepo.create({
              id: userId,
              balance,
            });
          }

          if (customer.balance < total) {
            const failedMessage = JSON.stringify({
              sagaId,
              statusCode: 400,
              service_name: 'payment_service',
              data: { orderId },
            });

            await this.producer.send({
              topic: 'micro-payment-failed',
              messages: [{ value: failedMessage }],
            });

            console.log(
              `[VALIDATE-PAYMENT-SERVICE] Sending message to the topic ${topic}`,
            );

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

          const successMessage = JSON.stringify({
            sagaId,
            id: payment.id,
            statusCode: 200,
            service_name: 'payment_service',
            newBalance,
            customerId: customer.id,
          });

          await this.producer.send({
            topic: 'micro-payment-success',
            messages: [{ value: successMessage }],
          });

          await this.customerPaymentHistoryPrismaRepo.create({
            balanceAfterPayment: newBalance,
            customerId: customer.id,
            paymentId: payment.id!,
            sagaId,
            totalPayable: total,
          });

          console.log(
            `${this.serviceTag} Message sent | topic: micro-payment-success | value: ${successMessage}`,
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
