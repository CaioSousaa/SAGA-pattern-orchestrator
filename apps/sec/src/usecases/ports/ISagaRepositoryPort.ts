import { Status } from 'generated/prisma';
import { Saga } from 'src/core/domain/entities/Saga';
import { CreateSagaSchemaDTO } from 'src/core/dtos/SagaDTO';

export interface ISagaRepositoryPort {
  create({ name_flow, status }: CreateSagaSchemaDTO): Promise<Saga>;
  update(sagaId: string, status: Status): Promise<Saga>;
}
