import { Status } from 'generated/prisma';
import { Saga } from '../domain/entities/Saga';
import { CreateSagaSchemaDTO } from '../dtos/SagaDTO';

export interface ISagaRepositoryPort {
  create({ name_flow, status }: CreateSagaSchemaDTO): Promise<Saga>;
  update(sagaId: string, status: Status): Promise<Saga>;
}
