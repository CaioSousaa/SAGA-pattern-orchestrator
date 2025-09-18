import { Payment } from 'src/core/domain/entities/Payment';

export interface ICreatePaymentDTO {
  customerId: string;
  productId: string;
}

export interface IPaymentRepositoryPort {
  create({ customerId, productId }: ICreatePaymentDTO): Promise<Payment>;
}
