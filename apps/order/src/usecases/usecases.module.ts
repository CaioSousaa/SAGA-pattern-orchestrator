import { Module } from '@nestjs/common';
import { ClientOrderProductService } from './ClientOrderProduct.service';
import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';
import { OrderPrismarRepository } from 'src/infra/prisma/repositories/OrderPrismaRepository';
import { ProductPrismarRepository } from 'src/infra/prisma/repositories/ProductPrismaRepository';
import { UpdateClientBalanceService } from './UpdateClientBalance.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ClientOrderProductService,
    ClientPrismarRepository,
    OrderPrismarRepository,
    ProductPrismarRepository,
    UpdateClientBalanceService,
  ],
})
export class UseCasesModule {}
