import { CustomerPaymentHistory } from 'src/core/domain/entities/CustomerPaymentHistory';
import { ICustomerPaymentHistoryDTO } from 'src/core/dtos/customerPaymentHistory/ICustomerPaymentHistoryDTO';

export interface ICustomerPaymentHistoryRepositoryPort {
  create(data: ICustomerPaymentHistoryDTO): Promise<CustomerPaymentHistory>;
}
