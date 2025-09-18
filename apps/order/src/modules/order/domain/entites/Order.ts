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
  createdAt: Date;

  constructor({
    clientId,
    client,
    productId,
    product,
    quantity,
    total,
    createdAt,
  }: Order) {
    Object.assign(this, {
      clientId,
      client,
      productId,
      product,
      quantity,
      total,
      createdAt,
    });
  }

  static create({ clientId, productId, quantity, total }: Order) {
    const order = new Order({
      clientId,
      productId,
      quantity,
      total,
      createdAt: new Date(),
    });

    return order;
  }
}
