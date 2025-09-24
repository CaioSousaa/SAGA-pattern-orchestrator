import { Customer } from 'generated/prisma';

export interface CreateCustomerDTO {
  id: string;
  balance: number;
}

export interface ICustomerRepositoryPort {
  create({ balance, id }: CreateCustomerDTO): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  update(id: string, balance: number): Promise<Customer>;
}
