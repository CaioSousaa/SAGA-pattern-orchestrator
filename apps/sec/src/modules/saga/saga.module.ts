import { Module } from '@nestjs/common';
import { SagaController } from './infra/http/controller/saga.controller';
import { KafkaConfigService } from '../kafka/KafkaConfig.service';
import { CreateOrderService } from './services/CreateOrder.service';
import { PrismaSagaRepository } from './infra/prisma/repositories/PrismaSagaRepository';
import { PrismaActionsRepository } from './infra/prisma/repositories/PrismaActionsRepository';

@Module({
  imports: [],
  controllers: [SagaController],
  providers: [
    KafkaConfigService,
    CreateOrderService,
    PrismaSagaRepository,
    PrismaActionsRepository,
  ],
})
export class SagaModule {}
