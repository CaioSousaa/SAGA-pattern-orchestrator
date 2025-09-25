import { Customer } from 'src/core/domain/entities/Customer';
import { Payment } from 'src/core/domain/entities/Payment';
import { ICreatePaymentDTO } from 'src/core/dtos/payment/ICreatePaymentDTO';
import { IReversalPaymentDTO } from 'src/core/dtos/payment/IReversalPaymentDTO';

export interface IPaymentRepositoryPort {
  create({ customerId, productId }: ICreatePaymentDTO): Promise<Payment>;
  reversalPayment(data: IReversalPaymentDTO): Promise<Customer | null>;
}
