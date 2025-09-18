import { MovimentType } from 'generated/prisma';
import prisma from 'src/database/prisma/prismaCliente';
import { Moviment } from 'src/modules/moviment/domain/entities/Moviment';
import {
  IMovimentCreate,
  IMovimentRepositoryPort,
  IMovimentUpdate,
} from 'src/modules/moviment/port/IMovimentRepositoryPort';

export class PrismaMovimentRepository implements IMovimentRepositoryPort {
  public async create({
    inventoryId,
    itemId,
    type,
  }: IMovimentCreate): Promise<Moviment> {
    return await prisma.moviment.create({
      data: { inventoryId, itemId, type, quantity: 0 },
    });
  }

  public async update(
    { inventoryId, itemId, quantity, type }: IMovimentUpdate,
    id: string,
  ): Promise<Moviment> {
    return await prisma.moviment.update({
      where: { id, itemId, inventoryId },
      data: { quantity, type },
    });
  }
}
