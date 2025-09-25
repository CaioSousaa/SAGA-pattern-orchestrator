import { Customer } from 'src/core/domain/entities/Customer';

export class CustomerPaymentHistory {
  id?: string;
  customerId: string;
  paymentId: number;
  balanceAfterPayment: number;
  totalPayable: number;
  sagaId: string;
  createdAt: Date;

  constructor({
    customerId,
    paymentId,
    balanceAfterPayment,
    totalPayable,
    sagaId,
    createdAt,
  }: CustomerPaymentHistory) {
    Object.assign(this, {
      customerId,
      paymentId,
      balanceAfterPayment,
      totalPayable,
      sagaId,
      createdAt,
    });
  }

  static create({
    customerId,
    paymentId,
    balanceAfterPayment,
    totalPayable,
    sagaId,
  }: CustomerPaymentHistory) {
    const history = new CustomerPaymentHistory({
      customerId,
      paymentId,
      balanceAfterPayment,
      totalPayable,
      sagaId,
      createdAt: new Date(),
    });

    return history;
  }
}
