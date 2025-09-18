import { Payment } from 'src/core/domain/entities/Payment';

export class Customer {
  id: string;
  balance: number;
  created_at: Date;
  payment?: Payment[];

  constructor({ id, balance, created_at }: Customer) {
    Object.assign(this, {
      id,
      balance,
      created_at,
    });
  }

  static create({ id, balance }: Customer) {
    const customer = new Customer({
      id,
      balance,
      created_at: new Date(),
    });

    return customer;
  }
}
