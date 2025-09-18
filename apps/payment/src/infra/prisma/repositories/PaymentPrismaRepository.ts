import prisma from 'src/database/prisma/prismaClient';
import { Payment } from 'src/core/domain/entities/Payment';
import {
  ICreatePaymentDTO,
  IPaymentRepositoryPort,
} from 'src/usecases/ports/IPaymentRepositoryPort';

export class PaymentPrismarRepository implements IPaymentRepositoryPort {
  public async create({
    customerId,
    productId,
  }: ICreatePaymentDTO): Promise<Payment> {
    return await prisma.payment.create({
      data: { customerId, productId },
    });
  }
}
