import { Item } from 'src/core/domain/entities/Item';
import { Moviment } from 'src/core/domain/entities/Moviment';

export class Inventory {
  id?: string;
  itemId: string;
  item?: Item;
  quantity: number;
  location?: string;
  createdAt: Date;
  moviments?: Moviment[];

  constructor({
    itemId,
    item,
    quantity,
    location,
    createdAt,
    moviments,
  }: Inventory) {
    Object.assign(this, {
      itemId,
      item,
      quantity,
      location,
      createdAt,
      moviments,
    });
  }

  static create({ itemId, quantity, location }: Inventory) {
    const inventory = new Inventory({
      itemId,
      quantity,
      location,
      createdAt: new Date(),
    });

    return inventory;
  }
}
