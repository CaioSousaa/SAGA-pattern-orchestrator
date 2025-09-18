import { Customer } from '../domain/entities/Customer';

export interface CreateCustomerDTO {
  id: string;
  balance: number;
}

export interface ICustomerRepositoryPort {
  create({ balance, id }: CreateCustomerDTO): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
}
