import { Inventory } from '../domain/entities/Inventory';

export interface ICreateItemInInventory {
  itemId: string;
  quantity: number;
}

export interface IUpdatedItemInInventory {
  itemId: string;
  id: string;
  quantity: number;
  updatedAt: Date;
}

export interface IInventoryRepositoryPort {
  createItemInInventory({
    itemId,
    quantity,
  }: ICreateItemInInventory): Promise<Inventory>;
  findByItemId(itemId: string): Promise<Inventory | null>;
  update({
    id,
    itemId,
    quantity,
    updatedAt,
  }: IUpdatedItemInInventory): Promise<Inventory>;
}
