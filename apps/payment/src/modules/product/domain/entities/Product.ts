import { Payment } from 'src/modules/payment/domain/entities/Payment';

export class Product {
  id?: string;
  name: string;
  price_in_cents: number;
  payments?: Payment[];

  constructor({ name, price_in_cents }: Product) {
    Object.assign(this, {
      name,
      price_in_cents,
    });
  }

  static create({ name, payments, price_in_cents }: Product) {
    const product = new Product({
      name,
      payments,
      price_in_cents,
    });

    return product;
  }
}
