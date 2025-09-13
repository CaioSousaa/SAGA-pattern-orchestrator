import { Saga } from 'src/modules/saga/domain/entities/Saga';
import { CreateSagaSchemaDTO } from 'src/modules/saga/dtos/SagaDTO';
import { ISagaRepositoryPort } from 'src/modules/saga/port/ISagaRepositoryPort';
import prisma from '../../../../../database/prisma/prismaClient';
import { Status } from 'generated/prisma';

export class PrismaSagaRepository implements ISagaRepositoryPort {
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
