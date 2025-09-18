import prisma from 'src/database/prisma/prismaClient';
import { Product } from 'src/core/domain/entities/Product';
import { ICreateProductDTO } from 'src/core/dtos/ICreateProductDTO';
import { IProductRepositoryPort } from 'src/usecases/ports/IProductRepositoryPort';

export class ProductPrismarRepository implements IProductRepositoryPort {
  async create({ id, name, price }: ICreateProductDTO): Promise<Product> {
    return await prisma.product.create({
      data: { id, name, price },
    });
  }
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });

    return product ?? null;
  }
}
