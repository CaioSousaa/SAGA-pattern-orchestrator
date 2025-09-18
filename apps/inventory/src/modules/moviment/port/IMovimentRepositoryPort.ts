import { MovimentType } from 'generated/prisma';
import { Moviment } from '../domain/entities/Moviment';

export interface IMovimentCreate {
  itemId: string;
  inventoryId: string;
  type: MovimentType;
}

export interface IMovimentUpdate {
  itemId: string;
  inventoryId: string;
  quantity: number;
  type: MovimentType;
}

export interface IMovimentRepositoryPort {
  create({ inventoryId, itemId }: IMovimentCreate): Promise<Moviment>;
  update(
    { inventoryId, itemId, quantity, type }: IMovimentUpdate,
    id: string,
  ): Promise<Moviment>;
}
