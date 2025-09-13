import { Payment } from 'src/modules/payment/domain/entities/Payment';

export class Product {
  id?: string;
  name: string;
  reference_number: number;
  price_in_cents: number;
  payments: Payment[];

  constructor({ name, payments, price_in_cents, reference_number }: Product) {
    Object.assign(this, {
      name,
      reference_number,
      price_in_cents,
      payments,
    });
  }

  static create({ name, payments, price_in_cents, reference_number }: Product) {
    const product = new Product({
      name,
      payments,
      price_in_cents,
      reference_number,
    });

    return product;
  }
}
