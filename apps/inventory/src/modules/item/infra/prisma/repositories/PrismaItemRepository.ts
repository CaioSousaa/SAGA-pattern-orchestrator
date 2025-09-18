import prisma from 'src/database/prisma/prismaCliente';
import { Item } from 'src/modules/item/domain/entities/Item';
import { IItemRepositoryPort } from 'src/modules/item/port/IItemRepositoryPort';

export class PrismaItemRepository implements IItemRepositoryPort {
  public async findById(id: string): Promise<Item | null> {
    const item = await prisma.item.findUnique({ where: { id } });

    return item ?? null;
  }
}
