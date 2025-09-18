import { Order } from '../domain/entites/Order';
import { ICreateOrderDTO } from '../dto/ICreateOrderDTO';

export interface IOrderRepositoryPort {
  create(data: ICreateOrderDTO): Promise<Order>;
}
