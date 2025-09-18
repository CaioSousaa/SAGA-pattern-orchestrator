import { Order } from 'src/core/domain/entities/Order';
import { ICreateOrderDTO } from 'src/core/dtos/ICreateOrderDTO';

export interface IOrderRepositoryPort {
  create(data: ICreateOrderDTO): Promise<Order>;
}
