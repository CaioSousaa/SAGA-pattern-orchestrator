import { Customer } from 'src/core/domain/entities/Customer';

export class Payment {
  id?: number;
  customerId?: string;
  customer?: Customer;
  productId?: string;
  created_at: Date;

  constructor({ customer, created_at, productId }: Payment) {
    Object.assign(this, { customer, created_at, productId });
  }

  static create({ customer, productId }: Payment) {
    const payment = new Payment({
      customerId: customer?.id,
      customer,
      productId,
      created_at: new Date(),
    });

    return payment;
  }
}
