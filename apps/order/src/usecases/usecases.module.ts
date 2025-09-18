import { Module } from '@nestjs/common';
import { ClientOrderProductService } from './ClientOrderProduct.service';
import { ClientPrismarRepository } from 'src/infra/prisma/repositories/ClientPrismaRepository';
import { OrderPrismarRepository } from 'src/infra/prisma/repositories/OrderPrismaRepository';
import { ProductPrismarRepository } from 'src/infra/prisma/repositories/ProductPrismaRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ClientOrderProductService,
    ClientPrismarRepository,
    OrderPrismarRepository,
    ProductPrismarRepository,
  ],
})
export class UseCasesModule {}
