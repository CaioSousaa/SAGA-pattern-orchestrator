import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';

import { kafka } from 'src/core/config/kafka';
import { PaymentPrismarRepository } from 'src/infra/prisma/repositories/PaymentPrismaRepository';

@Injectable()
export class CompensationPaymentService {
  private producer: Producer;
  private consumer: Consumer;
  private readonly serviceTag = '[COMPENSATION-PAYMENT-SERVICE]';

  constructor(private paymentPrismarRepo: PaymentPrismarRepository) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();

    this.consumer = kafka.consumer({ groupId: 'compensation-payment-group' });
    await this.consumer.connect();

    console.log(`${this.serviceTag} Consumer connected successfully!`);

    await this.consumer.subscribe({ topic: 'compensation-payment-service' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawMessage = message.value?.toString();
        const payload = rawMessage ? JSON.parse(rawMessage) : null;

        if (!payload) return;

        const { sagaId } = payload;

        console.log(
          `${this.serviceTag} Incoming message`,
          JSON.stringify({
            topic,
            partition,
            payload,
          }),
        );

        try {
          const refundedAmount = await this.paymentPrismarRepo.reversalPayment({
            sagaId,
          });

          console.log(
            `${this.serviceTag} Compensation applied successfully`,
            JSON.stringify({ sagaId, refundedAmount }),
          );

          const successMessage = {
            sagaId,
            statusCode: 200,
            service_name: 'payment_service',
            newBalance: refundedAmount?.balance,
            customerId: refundedAmount?.id,
          };

          await this.producer.send({
            topic: 'micro-payment-success',
            messages: [{ value: JSON.stringify(successMessage) }],
          });

          console.log(
            `${this.serviceTag} Sent success message to micro-payment-success`,
            JSON.stringify(successMessage),
          );
        } catch (error) {
          console.error(`${this.serviceTag} Error processing message`, error);

          const failureMessage = {
            service: 'compensation-inventory-service',
            status: 400,
            sagaId,
          };

          await this.producer.send({
            topic: 'compensation-inventory-failed',
            messages: [{ value: JSON.stringify(failureMessage) }],
          });

          console.log(
            `${this.serviceTag} Sent failure message to compensation-inventory-failed`,
            JSON.stringify(failureMessage),
          );
        }
      },
    });
  }
}
