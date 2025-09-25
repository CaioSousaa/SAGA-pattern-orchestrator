import { MovimentType } from 'generated/prisma';

export interface IUpdateMovimentDTO {
  itemId: string;
  inventoryId: string;
  quantity: number;
  type: MovimentType;
}
