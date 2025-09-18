import { Order } from 'src/core/domain/entities/Order';

export class Product {
  id?: string;
  name: string;
  price: number;
  createdAt: Date;
  orders?: Order[];

  constructor({ name, price, createdAt, orders }: Product) {
    Object.assign(this, {
      name,
      price,
      createdAt,
      orders,
    });
  }

  static create({ name, price }: Product) {
    const product = new Product({
      name,
      price,
      createdAt: new Date(),
    });

    return product;
  }
}
