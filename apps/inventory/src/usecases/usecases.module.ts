import { Module } from '@nestjs/common';
import { InventoryMovimentItemService } from './InventoryMovimentItem.service';
import { PrismaInventoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryRepository';
import { PrismaItemRepository } from 'src/infra/prisma/repositories/PrismaItemRepository';
import { PrismaMovimentRepository } from 'src/infra/prisma/repositories/PrismaMovimentRepository';
import { PrismaInventoryTransactionHistoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryTransactionHistoryRepository';
import { CompensationInventoryService } from './CompensationInventory.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    InventoryMovimentItemService,
    PrismaInventoryRepository,
    PrismaItemRepository,
    PrismaMovimentRepository,
    PrismaInventoryTransactionHistoryRepository,
    CompensationInventoryService,
  ],
})
export class UseCasesModule {}
