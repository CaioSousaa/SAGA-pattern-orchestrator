import { Inventory } from 'src/modules/inventory/domain/entities/Inventory';
import { Moviment } from 'src/modules/moviment/domain/entities/Moviment';

export class Item {
  id?: string;
  productId: string;
  name?: string;
  created_at: Date;
  inventory?: Inventory;
  moviments?: Moviment[];

  constructor({ productId, name, created_at, inventory, moviments }: Item) {
    Object.assign(this, {
      productId,
      name,
      created_at,
      inventory,
      moviments,
    });
  }

  static create({ productId, name }: Item) {
    const item = new Item({
      productId,
      name,
      created_at: new Date(),
    });

    return item;
  }
}
