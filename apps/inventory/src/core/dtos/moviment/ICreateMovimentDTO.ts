import { MovimentType } from 'generated/prisma';

export interface ICreateMovimentDTO {
  itemId: string;
  inventoryId: string;
  type: MovimentType;
  quantity: number;
}
