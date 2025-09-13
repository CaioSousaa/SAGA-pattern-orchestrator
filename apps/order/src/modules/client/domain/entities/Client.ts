import { Order } from 'src/modules/order/domain/entites/Order';

export class Client {
  id?: string;
  name: string;
  email: string;
  balance: number;
  created_at: Date;
  orders?: Order[];

  constructor({ name, email, balance, created_at, orders }: Client) {
    Object.assign(this, {
      name,
      email,
      balance,
      created_at,
      orders,
    });
  }

  static create({ name, email, balance }: Client) {
    const client = new Client({
      name,
      email,
      balance,
      created_at: new Date(),
    });

    return client;
  }
}
