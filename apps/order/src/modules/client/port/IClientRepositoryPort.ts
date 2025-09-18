import { Client } from '../domain/entities/Client';
import { ICreateClientDTO } from '../dto/ICreateClientDTO';

export interface IClientRepositoryPort {
  create(data: ICreateClientDTO): Promise<Client>;
  findClient(id: string): Promise<Client | null>;
}
