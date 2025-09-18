import { Injectable, OnModuleInit } from '@nestjs/common';
import { Producer, Consumer } from 'kafkajs';
import { PrismaActionsRepository } from '../infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from '../infra/prisma/repositories/PrismaSagaRepository';
import { SagaTopics } from '../domain/enums/TopicsEnum';
import { Status } from 'generated/prisma';
import { kafka } from '../../../config/kafka';
import { validateRequest } from '../utils/function/validateRequestCreateOrderService';

export interface IRequest {
  userId: string;
  productId: string;
  name: string;
  email: string;
  balance: number;
  name_product: string;
  price: number;
  quantity: number;
}

export interface IResponse {
  status: 'success' | 'error';
  message: string;
}

@Injectable()
export class CreateOrderService implements OnModuleInit {
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    private readonly prismaActionsRepository: PrismaActionsRepository,
    private readonly prismaSagaRepository: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[KAFKA-INITIAL-FLOW PRODUCER CONNECTED]');

    this.consumer = kafka.consumer({ groupId: 'saga-create-order-group' });
    await this.consumer.connect();
    console.log('[KAFKA-INITIAL-FLOW CONSUMER CONNECTED]');

    await this.consumer.subscribe({ topic: SagaTopics.ORDER });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `[KAFKA MESSAGE RECEIVED] Topic: ${topic} | Value: ${message.value?.toString()}`,
        );
      },
    });
  }

  private async sendMessage(message: string, topic: SagaTopics) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });

    console.log(`Message ${message} sent to topic ${topic}`);
  }

  public async execute(data?: IRequest): Promise<IResponse> {
    try {
      const validatedData = validateRequest(data);

      const saga = await this.prismaSagaRepository.create({
        name_flow: 'start flow',
        status: Status.PENDING,
      });

      await this.prismaActionsRepository.create({
        name_action: 'create order',
        saga_id: saga.id!,
      });

      const message = {
        ...validatedData,
        sagaId: saga.id,
      };

      await this.sendMessage(JSON.stringify(message), SagaTopics.INITIAL_FLOW);

      return {
        status: 'success',
        message: 'Order created and event sent successfully',
      };
    } catch (error) {
      console.error('[CreateOrderService] Failed to create order:', error);

      return {
        status: 'error',
        message: 'Failed to create order. Check logs for details.',
      };
    }
  }
}
