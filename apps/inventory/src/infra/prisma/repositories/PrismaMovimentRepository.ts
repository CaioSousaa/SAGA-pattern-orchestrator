import { MovimentType } from 'generated/prisma';
import prisma from 'src/database/prisma/prismaCliente';
import { Moviment } from 'src/core/domain/entities/Moviment';
import { IMovimentRepositoryPort } from 'src/usecases/ports/IMovimentRepositoryPort';
import { ICreateMovimentDTO } from 'src/core/dtos/moviment/ICreateMovimentDTO';
import { IUpdateMovimentDTO } from 'src/core/dtos/moviment/IUpdateMovimentDTO';

export class PrismaMovimentRepository implements IMovimentRepositoryPort {
  public async create({
    inventoryId,
    itemId,
    type,
    quantity,
  }: ICreateMovimentDTO): Promise<Moviment> {
    return await prisma.moviment.create({
      data: { inventoryId, itemId, type, quantity },
    });
  }

  public async update(
    { inventoryId, itemId, quantity, type }: IUpdateMovimentDTO,
    id: string,
  ): Promise<Moviment> {
    return await prisma.moviment.update({
      where: { id, itemId, inventoryId },
      data: { quantity, type },
    });
  }
}
