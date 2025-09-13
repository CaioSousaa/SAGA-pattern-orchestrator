import { Customer } from 'src/modules/customer/domain/entities/Customer';
import { Product } from 'src/modules/product/domain/entities/Product';

export class Payment {
  id?: number;
  customerId?: string;
  customer?: Customer;
  productId?: string;
  product?: Product;
  created_at: Date;

  constructor({ customer, product, created_at }: Payment) {
    Object.assign(this, { customer, product, created_at });
  }

  static create({ customer, product }: Payment) {
    const payment = new Payment({
      customerId: customer?.id,
      customer,
      productId: product?.id,
      product,
      created_at: new Date(),
    });

    return payment;
  }
}
