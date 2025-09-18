import { ISagaRepositoryPort } from 'src/usecases/ports/ISagaRepositoryPort';
import { Status } from 'generated/prisma';
import { Saga } from 'src/core/domain/entities/Saga';
import prisma from 'src/database/prisma/prismaClient';
import { CreateSagaSchemaDTO } from 'src/core/dtos/SagaDTO';

export class PrismaSagaRepository implements ISagaRepositoryPort {
  public async update(sagaId: string, status: Status): Promise<Saga> {
    return prisma.saga.update({
      where: { id: sagaId },
      data: { status: status },
    });
  }

  public async create({
    name_flow,
    status,
  }: CreateSagaSchemaDTO): Promise<Saga> {
    return await prisma.saga.create({
      data: {
        name_flow,
        status: status ?? Status.PENDING,
        created_at: new Date(),
      },
    });
  }
}
