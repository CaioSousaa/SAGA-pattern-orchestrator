import { Actions } from 'src/core/domain/entities/Actions';
import { CreateActionSchemaDTO } from 'src/core/dtos/ActionsDTO';

export interface IActionsRepositoryPort {
  create({ name_action, saga_id }: CreateActionSchemaDTO): Promise<Actions>;
}
