import { Item } from '../domain/entities/Item';

export interface IItemRepositoryPort {
  findById(id: string): Promise<Item | null>;
}
