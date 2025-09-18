import { Module } from '@nestjs/common';
import { SagaController } from './infra/http/controller/saga.controller';
import { CreateOrderService } from './services/CreateOrder.service';
import { PrismaSagaRepository } from './infra/prisma/repositories/PrismaSagaRepository';
import { PrismaActionsRepository } from './infra/prisma/repositories/PrismaActionsRepository';
import { ConfirmOrderService } from './services/ConfirmOrder.service';

@Module({
  imports: [],
  controllers: [SagaController],
  providers: [
    CreateOrderService,
    PrismaSagaRepository,
    PrismaActionsRepository,
    ConfirmOrderService,
  ],
})
export class SagaModule {}
