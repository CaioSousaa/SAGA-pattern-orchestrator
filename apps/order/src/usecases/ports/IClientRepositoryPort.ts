import { ICreateClientDTO } from 'src/core/dtos/ICreateClientDTO';
import { Client } from '../../core/domain/entities/Client';

export interface IClientRepositoryPort {
  create(data: ICreateClientDTO): Promise<Client>;
  findClient(id: string): Promise<Client | null>;
}
