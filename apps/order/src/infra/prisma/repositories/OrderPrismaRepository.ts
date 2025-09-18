import prisma from 'src/database/prisma/prismaClient';
import { Order } from 'src/core/domain/entities/Order';
import { ICreateOrderDTO } from 'src/core/dtos/ICreateOrderDTO';
import { IOrderRepositoryPort } from 'src/usecases/ports/IOrderRepositoryPort';

export class OrderPrismarRepository implements IOrderRepositoryPort {
  public async create({
    clientId,
    productId,
    quantity,
    total,
  }: ICreateOrderDTO): Promise<Order> {
    return await prisma.order.create({
      data: { clientId, productId, quantity, total },
    });
  }
}
