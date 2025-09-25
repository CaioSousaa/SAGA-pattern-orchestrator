import prisma from 'src/database/prisma/prismaClient';
import { Order } from 'src/core/domain/entities/Order';
import { ICreateOrderDTO } from 'src/core/dtos/ICreateOrderDTO';
import { IOrderRepositoryPort } from 'src/usecases/ports/IOrderRepositoryPort';

export class OrderPrismaRepository implements IOrderRepositoryPort {
  public async compensationOrder(orderId: string): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED' },
    });
  }

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
