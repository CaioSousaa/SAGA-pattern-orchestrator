import { Client } from 'src/modules/client/domain/entities/Client';
import { Product } from 'src/modules/product/domain/entities/Product';

export class Order {
  id?: string;
  clientId: string;
  client?: Client;
  productId: string;
  product?: Product;
  quantity: number;
  total: number;
  created_at: Date;

  constructor({
    clientId,
    client,
    productId,
    product,
    quantity,
    total,
    created_at,
  }: Order) {
    Object.assign(this, {
      clientId,
      client,
      productId,
      product,
      quantity,
      total,
      created_at,
    });
  }

  static create({ clientId, productId, quantity, total }: Order) {
    const order = new Order({
      clientId,
      productId,
      quantity,
      total,
      created_at: new Date(),
    });

    return order;
  }
}
