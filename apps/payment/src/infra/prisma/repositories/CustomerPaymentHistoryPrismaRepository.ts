import { CustomerPaymentHistory } from 'src/core/domain/entities/CustomerPaymentHistory';
import { ICustomerPaymentHistoryDTO } from 'src/core/dtos/customerPaymentHistory/ICustomerPaymentHistoryDTO';
import prisma from 'src/database/prisma/prismaClient';
import { ICustomerPaymentHistoryRepositoryPort } from 'src/usecases/ports/ICustomerPaymentHistoryRepositoryPort';

export class CustomerPaymentHistoryPrismaRepository
  implements ICustomerPaymentHistoryRepositoryPort
{
  public async create({
    balanceAfterPayment,
    customerId,
    paymentId,
    sagaId,
    totalPayable,
  }: ICustomerPaymentHistoryDTO): Promise<CustomerPaymentHistory> {
    return await prisma.customerPaymentHistory.create({
      data: {
        balanceAfterPayment,
        customerId,
        paymentId,
        sagaId,
        totalPayable,
      },
    });
  }
}
