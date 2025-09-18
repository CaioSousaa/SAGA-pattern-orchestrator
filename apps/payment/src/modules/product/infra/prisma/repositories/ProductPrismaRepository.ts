import prisma from 'src/database/prisma/prismaClient';
import { Product } from 'src/modules/product/domain/entities/Product';
import {
  ICreateProductDTO,
  IProductRepositoryPort,
} from 'src/modules/product/port/IProductRepositoryPort';

export class ProductPrismarRepository implements IProductRepositoryPort {
  public async create({
    id,
    name,
    price_in_cents,
  }: ICreateProductDTO): Promise<Product> {
    return await prisma.product.create({ data: { id, name, price_in_cents } });
  }

  public async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });

    return product ?? null;
  }
}
