import prisma from 'src/database/prisma/prismaClient';
import { Order } from 'src/modules/order/domain/entites/Order';
import { ICreateOrderDTO } from 'src/modules/order/dto/ICreateOrderDTO';

import { IOrderRepositoryPort } from 'src/modules/order/port/IOrderRepositoryPort';

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
