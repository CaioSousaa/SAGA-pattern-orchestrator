import { ICreateProductDTO } from 'src/core/dtos/ICreateProductDTO';
import { Product } from '../../core/domain/entities/Product';

export interface IProductRepositoryPort {
  create(data: ICreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}
