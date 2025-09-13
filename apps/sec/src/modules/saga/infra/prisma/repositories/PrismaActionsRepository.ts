import prisma from 'src/database/prisma/prismaClient';
import { Actions } from 'src/modules/saga/domain/entities/Actions';
import { CreateActionSchemaDTO } from 'src/modules/saga/dtos/ActionsDTO';
import { IActionsRepositoryPort } from 'src/modules/saga/port/IActionsRepositoryPort';

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
