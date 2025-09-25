import { MovimentType } from 'generated/prisma';

export interface ICreateInventoryTransactionHistoryDTO {
  itemId: string;
  item_name: string;
  inventoryId: string;
  quantity: number;
  sagaId: string;
  typeMoviment: MovimentType;
}
