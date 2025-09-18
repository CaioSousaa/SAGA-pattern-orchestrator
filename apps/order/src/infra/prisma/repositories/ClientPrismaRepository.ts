import prisma from 'src/database/prisma/prismaClient';
import { Client } from 'src/core/domain/entities/Client';
import { ICreateClientDTO } from 'src/core/dtos/ICreateClientDTO';
import { IClientRepositoryPort } from 'src/usecases/ports/IClientRepositoryPort';

export class ClientPrismarRepository implements IClientRepositoryPort {
  public async create({
    id,
    balance,
    email,
    name,
  }: ICreateClientDTO): Promise<Client> {
    return await prisma.client.create({
      data: { id, balance, name, email },
    });
  }

  public async findClient(id: string): Promise<Client | null> {
    const client = await prisma.client.findUnique({ where: { id } });

    return client ?? null;
  }
}
