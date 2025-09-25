import { Customer } from 'generated/prisma';
import { ICreateCustomerDTO } from 'src/core/dtos/customer/ICreateCustomerDTO';

export interface ICustomerRepositoryPort {
  create({ balance, id }: ICreateCustomerDTO): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  update(id: string, balance: number): Promise<Customer>;
}
