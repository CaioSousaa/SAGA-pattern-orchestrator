import { Order } from 'src/modules/order/domain/entites/Order';

export class Product {
  id?: string;
  name: string;
  price: number;
  created_at: Date;
  orders?: Order[];

  constructor({ name, price, created_at, orders }: Product) {
    Object.assign(this, {
      name,
      price,
      created_at,
      orders,
    });
  }

  static create({ name, price }: Product) {
    const product = new Product({
      name,
      price,
      created_at: new Date(),
    });

    return product;
  }
}
