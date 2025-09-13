import { Inventory } from 'src/modules/inventory/domain/entities/Inventory';
import { Item } from 'src/modules/item/domain/entities/Item';

export enum MovimentType {
  IN = 'IN',
  OUT = 'OUT',
  RESERVE = 'RESERVE',
  RELEASE = 'RELEASE',
  ADJUST = 'ADJUST',
}

export class Moviment {
  id?: string;
  itemId: string;
  item?: Item;
  inventoryId?: string;
  inventory?: Inventory;
  type: MovimentType;
  quantity: number;
  created_at: Date;

  constructor({
    itemId,
    item,
    inventoryId,
    inventory,
    type,
    quantity,
    created_at,
  }: Moviment) {
    Object.assign(this, {
      itemId,
      item,
      inventoryId,
      inventory,
      type,
      quantity,
      created_at,
    });
  }

  static create({ itemId, type, quantity, inventoryId }: Moviment) {
    const moviment = new Moviment({
      itemId,
      type,
      quantity,
      inventoryId,
      created_at: new Date(),
    });

    return moviment;
  }
}
