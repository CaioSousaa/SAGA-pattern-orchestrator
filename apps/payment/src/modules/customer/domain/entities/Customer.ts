import { Payment } from 'src/modules/payment/domain/entities/Payment';

export class Customer {
  id?: string;
  name: string;
  email: string;
  balance: number;
  created_at: Date;
  payment?: Payment[];

  constructor({ name, email, balance, created_at }: Customer) {
    Object.assign(this, {
      name,
      balance,
      email,
      created_at,
    });
  }

  static create({ name, email, balance }: Customer) {
    const customer = new Customer({
      name,
      email,
      balance,
      created_at: new Date(),
    });

    return customer;
  }
}
