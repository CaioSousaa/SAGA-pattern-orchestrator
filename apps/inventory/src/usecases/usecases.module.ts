import { Module } from '@nestjs/common';
import { InventoryMovimentItemService } from './InventoryMovimentItem.service';
import { PrismaInventoryRepository } from 'src/infra/prisma/repositories/PrismaInventoryRepository';
import { PrismaItemRepository } from 'src/infra/prisma/repositories/PrismaItemRepository';
import { PrismaMovimentRepository } from 'src/infra/prisma/repositories/PrismaMovimentRepository';

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
export class UseCasesModule {}
