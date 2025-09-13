import { Injectable, NotAcceptableException } from '@nestjs/common';
import { KafkaConfigService } from 'src/modules/kafka/KafkaConfig.service';
import { PrismaActionsRepository } from '../infra/prisma/repositories/PrismaActionsRepository';
import { PrismaSagaRepository } from '../infra/prisma/repositories/PrismaSagaRepository';
import { SagaTopics } from '../domain/enums/TopicsEnum';
import { Status } from 'generated/prisma';

export interface IRequest {
  name: string;
  email: string;
  balance: number;
}

export interface IResponse {
  status: 'success' | 'error';
  message: string;
}

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly kafkaConfigService: KafkaConfigService,
    private readonly prismaActionsRepository: PrismaActionsRepository,
    private readonly prismaSagaRepository: PrismaSagaRepository,
  ) {}

  public async execute(data?: IRequest): Promise<IResponse> {
    if (!data) {
      throw new NotAcceptableException('Request body is missing');
    }

    const { name, email, balance } = data;

    if (!name || !email || balance === undefined) {
      throw new NotAcceptableException('Required fields are missing');
    }

    try {
      const message = JSON.stringify({ name, email, balance });

      await this.kafkaConfigService.sendMessage(
        message,
        SagaTopics.INITIAL_FLOW,
      );

      const saga = await this.prismaSagaRepository.create({
        name_flow: 'start flow',
        status: Status.PENDING,
      });

      await this.prismaActionsRepository.create({
        name_action: 'create order',
        saga_id: saga.id!,
      });

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
