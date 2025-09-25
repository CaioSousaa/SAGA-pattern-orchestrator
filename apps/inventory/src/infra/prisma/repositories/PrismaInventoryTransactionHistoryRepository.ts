import { InventoryTransactionHistory } from 'src/core/domain/entities/InventoryTransactionHistory';
import { ICreateInventoryTransactionHistoryDTO } from 'src/core/dtos/inventoryTransactionHistory/ICreateInventoryTransactionHistoryDTO';
import prisma from 'src/database/prisma/prismaCliente';
import { IInventoryTransactionHistoryRepositoryPort } from 'src/usecases/ports/InventoryTransactionHistory';

export class PrismaInventoryTransactionHistoryRepository
  implements IInventoryTransactionHistoryRepositoryPort
{
  public async findBySagaId(
    sagaId: string,
  ): Promise<InventoryTransactionHistory | null> {
    return await prisma.inventoryTransactionHistory.findUnique({
      where: { sagaId },
    });
  }

  public async create({
    inventoryId,
    itemId,
    item_name,
    quantity,
    sagaId,
    typeMoviment,
  }: ICreateInventoryTransactionHistoryDTO): Promise<InventoryTransactionHistory> {
    return await prisma.inventoryTransactionHistory.create({
      data: { inventoryId, item_name, itemId, quantity, sagaId, typeMoviment },
    });
  }
}
