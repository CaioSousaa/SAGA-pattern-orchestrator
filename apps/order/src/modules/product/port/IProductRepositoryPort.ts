import { Product } from '../domain/entities/Product';
import { ICreateProductDTO } from '../dto/ICreateProductDTO';

export interface IProductRepositoryPort {
  create(data: ICreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}
