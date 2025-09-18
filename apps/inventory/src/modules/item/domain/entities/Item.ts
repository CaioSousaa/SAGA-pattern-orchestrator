import { Inventory } from 'src/modules/inventory/domain/entities/Inventory';
import { Moviment } from 'src/modules/moviment/domain/entities/Moviment';

export class Item {
  id?: string;
  name: string;
  createdAt: Date;
  inventory?: Inventory;
  moviments?: Moviment[];

  constructor({ name, createdAt, inventory, moviments }: Item) {
    Object.assign(this, {
      name,
      createdAt,
      inventory,
      moviments,
    });
  }

  static create({ name }: Item) {
    const item = new Item({
      name,
      createdAt: new Date(),
    });

    return item;
  }
}
