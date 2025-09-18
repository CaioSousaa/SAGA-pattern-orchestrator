import { Order } from 'src/modules/order/domain/entites/Order';

export class Client {
  id?: string;
  name: string;
  email: string;
  balance: number;
  createdAt: Date;
  orders?: Order[];

  constructor({ name, email, balance, createdAt, orders }: Client) {
    Object.assign(this, {
      name,
      email,
      balance,
      createdAt,
      orders,
    });
  }

  static create({ name, email, balance }: Client) {
    const client = new Client({
      name,
      email,
      balance,
      createdAt: new Date(),
    });

    return client;
  }
}
