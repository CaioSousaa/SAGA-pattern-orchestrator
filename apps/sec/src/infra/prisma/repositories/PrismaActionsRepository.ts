import { Actions } from 'src/core/domain/entities/Actions';
import { CreateActionSchemaDTO } from 'src/core/dtos/ActionsDTO';
import prisma from 'src/database/prisma/prismaClient';

import { IActionsRepositoryPort } from 'src/usecases/ports/IActionsRepositoryPort';

export class PrismaActionsRepository implements IActionsRepositoryPort {
  public async create({
    name_action,
    saga_id,
  }: CreateActionSchemaDTO): Promise<Actions> {
    return await prisma.action.create({
      data: { name_action, saga_id, created_at: new Date() },
    });
  }
}
