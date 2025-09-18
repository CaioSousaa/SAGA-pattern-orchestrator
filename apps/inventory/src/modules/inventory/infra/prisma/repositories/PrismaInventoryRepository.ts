import prisma from 'src/database/prisma/prismaCliente';
import { Inventory } from 'src/modules/inventory/domain/entities/Inventory';
import {
  ICreateItemInInventory,
  IInventoryRepositoryPort,
  IUpdatedItemInInventory,
} from 'src/modules/inventory/port/IInventoryRepositoryPort';

export class PrismaInventoryRepository implements IInventoryRepositoryPort {
  public async update({
    id,
    itemId,
    quantity,
    updatedAt,
  }: IUpdatedItemInInventory): Promise<Inventory> {
    return await prisma.inventory.update({
      where: { id, itemId },
      data: { quantity, updatedAt },
    });
  }
  public async createItemInInventory({
    itemId,
    quantity,
  }: ICreateItemInInventory): Promise<Inventory> {
    return await prisma.inventory.create({ data: { itemId, quantity } });
  }

  public async findByItemId(itemId: string): Promise<Inventory | null> {
    const inventory = await prisma.inventory.findUnique({ where: { itemId } });

    return inventory ?? null;
  }
}
