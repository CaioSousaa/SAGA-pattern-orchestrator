import { Module } from '@nestjs/common';
import { ConfirmOrderService } from './ConfirmOrder.service';
import { CreateOrderService } from './CreateOrder.service';
import { PrismaSagaRepository } from 'src/infra/prisma/repositories/PrismaSagaRepository';
import { PrismaActionsRepository } from 'src/infra/prisma/repositories/PrismaActionsRepository';
import { SagaController } from 'src/infra/http/controller/saga.controller';

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
export class UseCasesModule {}
