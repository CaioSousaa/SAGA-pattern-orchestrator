import { Item } from 'src/modules/item/domain/entities/Item';
import { Moviment } from 'src/modules/moviment/domain/entities/Moviment';

export class Inventory {
  id?: string;
  itemId: string;
  item?: Item;
  quantity: number;
  reserved: number;
  location?: string;
  created_at: Date;
  moviments?: Moviment[];

  constructor({
    itemId,
    item,
    quantity,
    reserved,
    location,
    created_at,
    moviments,
  }: Inventory) {
    Object.assign(this, {
      itemId,
      item,
      quantity,
      reserved,
      location,
      created_at,
      moviments,
    });
  }

  static create({ itemId, quantity, reserved, location }: Inventory) {
    const inventory = new Inventory({
      itemId,
      quantity,
      reserved,
      location,
      created_at: new Date(),
    });

    return inventory;
  }
}
