import { Inventory } from 'src/core/domain/entities/Inventory';
import { ICreateItemInInventoryDTO } from 'src/core/dtos/inventory/ICreateItemInInventoryDTO';
import { IUpdatedItemInInventoryDTO } from 'src/core/dtos/inventory/IUpdatedItemInInventoryDTO';

export interface IInventoryRepositoryPort {
  createItemInInventory({
    itemId,
    quantity,
  }: ICreateItemInInventoryDTO): Promise<Inventory>;
  findByItemId(itemId: string): Promise<Inventory | null>;
  update({
    id,
    itemId,
    quantity,
    updatedAt,
  }: IUpdatedItemInInventoryDTO): Promise<Inventory>;
}
