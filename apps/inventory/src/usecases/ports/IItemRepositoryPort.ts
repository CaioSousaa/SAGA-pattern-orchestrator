import { Item } from 'src/core/domain/entities/Item';

export interface IItemRepositoryPort {
  findById(id: string): Promise<Item | null>;
}
