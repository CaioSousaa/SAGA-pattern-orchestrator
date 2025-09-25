import { Moviment } from 'src/core/domain/entities/Moviment';
import { ICreateMovimentDTO } from 'src/core/dtos/moviment/ICreateMovimentDTO';
import { IUpdateMovimentDTO } from 'src/core/dtos/moviment/IUpdateMovimentDTO';

export interface IMovimentRepositoryPort {
  create({
    inventoryId,
    itemId,
    quantity,
  }: ICreateMovimentDTO): Promise<Moviment>;
  update(
    { inventoryId, itemId, quantity, type }: IUpdateMovimentDTO,
    id: string,
  ): Promise<Moviment>;
}
