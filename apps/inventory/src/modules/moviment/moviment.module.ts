import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryMovimentItemService } from './services/InventoryMovimentItem.service';
import { PrismaInventoryRepository } from '../inventory/infra/prisma/repositories/PrismaInventoryRepository';
import { PrismaItemRepository } from '../item/infra/prisma/repositories/PrismaItemRepository';
import { PrismaMovimentRepository } from './infra/prisma/repositories/PrismaMovimentRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    InventoryMovimentItemService,
    PrismaInventoryRepository,
    PrismaItemRepository,
    PrismaMovimentRepository,
  ],
})
export class MovimentModule {}
