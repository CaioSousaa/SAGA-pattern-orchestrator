import prisma from 'src/database/prisma/prismaClient';
import { Payment } from 'src/core/domain/entities/Payment';
import { IPaymentRepositoryPort } from 'src/usecases/ports/IPaymentRepositoryPort';
import { ICreatePaymentDTO } from 'src/core/dtos/payment/ICreatePaymentDTO';
import { IReversalPaymentDTO } from 'src/core/dtos/payment/IReversalPaymentDTO';
import { Customer } from 'src/core/domain/entities/Customer';

export class PaymentPrismarRepository implements IPaymentRepositoryPort {
  public async reversalPayment({
    sagaId,
  }: IReversalPaymentDTO): Promise<Customer | null> {
    const customerPaymentHistory =
      await prisma.customerPaymentHistory.findFirst({
        where: { sagaId },
      });

    if (!customerPaymentHistory) {
      return null;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerPaymentHistory?.customerId },
    });

    if (!customer) {
      return null;
    }

    const reversalPayment =
      customerPaymentHistory.balanceAfterPayment +
      customerPaymentHistory.totalPayable;

    const customerUpdated = await prisma.customer.update({
      where: { id: customer.id },
      data: { balance: reversalPayment },
    });

    return customerUpdated;
  }

  public async create({
    customerId,
    productId,
  }: ICreatePaymentDTO): Promise<Payment> {
    return await prisma.payment.create({
      data: { customerId, productId },
    });
  }
}
