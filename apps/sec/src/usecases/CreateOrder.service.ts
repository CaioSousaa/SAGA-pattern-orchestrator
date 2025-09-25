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
  private readonly serviceTag = '[CREATE-ORDER-SERVICE]';

  constructor(
    private readonly actionsRepo: PrismaActionsRepository,
    private readonly sagaRepo: PrismaSagaRepository,
  ) {}

  async onModuleInit() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log(`${this.serviceTag} Kafka producer connected`);
  }

  private async sendMessage(message: string, topic: SagaTopicsSent) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });

    console.log(
      `${this.serviceTag} Message sent | topic: ${topic} | value: ${message}`,
    );
  }

  public async execute(data?: IRequest): Promise<IResponse> {
    try {
      const validatedData = validateRequest(data);

      const saga = await this.sagaRepo.create({
        name_flow: 'start flow',
        status: Status.PENDING,
      });

      await this.actionsRepo.create({
        name_action: 'sent: create order',
        saga_id: saga.id!,
      });

      const message = { ...validatedData, sagaId: saga.id };

      await this.sendMessage(
        JSON.stringify(message),
        SagaTopicsSent.INITIAL_FLOW,
      );

      return {
        status: 'success',
        message: 'Order created and event sent successfully',
      };
    } catch (error) {
      console.error(`${this.serviceTag} Failed to create order:`, error);

      return {
        status: 'error',
        message: 'Failed to create order. Check logs for details.',
      };
    }
  }
}
