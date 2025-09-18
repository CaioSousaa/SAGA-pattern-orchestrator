import { MovimentType } from 'generated/prisma';
import { Inventory } from 'src/modules/inventory/domain/entities/Inventory';
import { Item } from 'src/modules/item/domain/entities/Item';

export class Moviment {
  id?: string;
  itemId: string;
  item?: Item;
  inventoryId: string;
  inventory?: Inventory;
  type: MovimentType;
  quantity: number;
  createdAt: Date;

  constructor({
    itemId,
    item,
    inventoryId,
    inventory,
    type,
    quantity,
    createdAt,
  }: Moviment) {
    Object.assign(this, {
      itemId,
      item,
      inventoryId,
      inventory,
      type,
      quantity,
      createdAt,
    });
  }

  static create({ itemId, type, quantity, inventoryId }: Moviment) {
    const moviment = new Moviment({
      itemId,
      type,
      quantity,
      inventoryId,
      createdAt: new Date(),
    });

    return moviment;
  }
}
