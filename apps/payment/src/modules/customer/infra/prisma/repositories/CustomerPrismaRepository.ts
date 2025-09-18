import prisma from 'src/database/prisma/prismaClient';
import { Customer } from 'src/modules/customer/domain/entities/Customer';
import {
  CreateCustomerDTO,
  ICustomerRepositoryPort,
} from 'src/modules/customer/port/ICustomerRepositoryPort';

export class CustomerPrismarRepository implements ICustomerRepositoryPort {
  public async create({ balance, id }: CreateCustomerDTO): Promise<Customer> {
    return await prisma.customer.create({
      data: { balance, id },
    });
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { id } });

    return customer ?? null;
  }
}
