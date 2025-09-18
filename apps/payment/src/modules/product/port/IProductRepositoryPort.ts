import { Product } from '../domain/entities/Product';

export interface ICreateProductDTO {
  id: string;
  name: string;
  price_in_cents: number;
}

export interface IProductRepositoryPort {
  create({ id, name, price_in_cents }: ICreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}
