import { Injectable, OnModuleInit } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { PrismaActionsRepository } from '../infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from '../infra/prisma/repositories/PrismaSagaRepository';
import { Status } from 'generated/prisma';
import { kafka } from '../core/config/kafka';
import { validateRequest } from './utils/function/validateRequestCreateOrderService';
import { SagaTopicsSent } from 'src/core/domain/enums/TopicsEnum';

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

  constructor(
    private readonly prismaActionsRepository: PrismaActionsRepository,
    private readonly prismaSagaRepository: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log('[KAFKA-PRODUCER CONNECTED]');
  }

  private async sendMessage(message: string, topic: SagaTopicsSent) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });

    console.log(`[KAFKA MESSAGE SENT] Topic: ${topic} | Value: ${message}`);
  }

  public async execute(data?: IRequest): Promise<IResponse> {
    try {
      const validatedData = validateRequest(data);

      const saga = await this.prismaSagaRepository.create({
        name_flow: 'start flow',
        status: Status.PENDING,
      });

      await this.prismaActionsRepository.create({
        name_action: 'sent: create order',
        saga_id: saga.id!,
      });

      const message = {
        ...validatedData,
        sagaId: saga.id,
      };

      await this.sendMessage(
        JSON.stringify(message),
        SagaTopicsSent.INITIAL_FLOW,
      );

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
