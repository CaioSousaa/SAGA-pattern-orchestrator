import prisma from 'src/database/prisma/prismaClient';
import { Product } from 'src/modules/product/domain/entities/Product';
import { ICreateProductDTO } from 'src/modules/product/dto/ICreateProductDTO';
import { IProductRepositoryPort } from 'src/modules/product/port/IProductRepositoryPort';

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
