import prisma from 'src/database/prisma/prismaClient';
import { Customer } from 'src/core/domain/entities/Customer';
import { ICustomerRepositoryPort } from 'src/usecases/ports/ICustomerRepositoryPort';
import { ICreateCustomerDTO } from 'src/core/dtos/customer/ICreateCustomerDTO';

export class CustomerPrismarRepository implements ICustomerRepositoryPort {
  public async update(id: string, balance: number): Promise<Customer> {
    return await prisma.customer.update({
      where: { id },
      data: { balance },
    });
  }
  public async create({ balance, id }: ICreateCustomerDTO): Promise<Customer> {
    return await prisma.customer.create({
      data: { balance, id },
    });
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { id } });

    return customer ?? null;
  }
}
