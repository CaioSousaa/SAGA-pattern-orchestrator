import { Module } from '@nestjs/common';
import { ClientOrderProductService } from './services/ClientOrderProduct.service';
import { ClientPrismarRepository } from '../client/infra/prisma/repositories/ClientPrismaRepository';
import { OrderPrismarRepository } from './infra/prisma/repositories/OrderPrismaRepository';
import { ProductPrismarRepository } from '../product/infra/prisma/repositories/ProductPrismaRepository';

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
export class OrderModule {}
