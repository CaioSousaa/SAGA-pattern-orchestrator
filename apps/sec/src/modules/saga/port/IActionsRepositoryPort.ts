import { Actions } from '../domain/entities/Actions';
import { CreateActionSchemaDTO } from '../dtos/ActionsDTO';

export interface IActionsRepositoryPort {
  create({ name_action, saga_id }: CreateActionSchemaDTO): Promise<Actions>;
}
