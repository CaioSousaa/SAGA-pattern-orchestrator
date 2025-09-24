import { ISagaRepositoryPort } from 'src/usecases/ports/ISagaRepositoryPort';
import { Status } from 'generated/prisma';
import { Saga } from 'src/core/domain/entities/Saga';
import prisma from 'src/database/prisma/prismaClient';
import { CreateSagaSchemaDTO } from 'src/core/dtos/SagaDTO';
import { Actions } from 'src/core/domain/entities/Actions';

export class PrismaSagaRepository implements ISagaRepositoryPort {
  public async hasActions(sagaId: string): Promise<Boolean> {
    const query = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM action a
      WHERE a.saga_id = ${sagaId}
        AND a.name_action IN ('recevid: payment_service', 'recevid: moviment_service')
      GROUP BY a.saga_id
      HAVING COUNT(DISTINCT a.name_action) = 2
    ) AS "exists";
  `;

    return query[0]?.exists ?? false;
  }

  public async findActionsBySagaId(sagaId: string): Promise<Actions[]> {
    return await prisma.$queryRaw`
      SELECT * 
      from action
      inner join sec
      on sec.id = action.saga_id
      where sec.id = ${sagaId}
    `;
  }

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
