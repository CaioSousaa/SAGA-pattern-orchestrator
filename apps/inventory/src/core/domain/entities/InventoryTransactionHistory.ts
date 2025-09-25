import { MovimentType } from 'generated/prisma';

export class InventoryTransactionHistory {
  id?: string;
  itemId: string;
  item_name: string;
  inventoryId: string;
  quantity: number;
  sagaId: string;
  typeMoviment: MovimentType;
  createdAt: Date;

  constructor({
    itemId,
    item_name,
    inventoryId,
    quantity,
    sagaId,
    typeMoviment,
    createdAt,
  }: InventoryTransactionHistory) {
    Object.assign(this, {
      itemId,
      item_name,
      inventoryId,
      quantity,
      sagaId,
      typeMoviment,
      createdAt,
    });
  }

  static create({
    itemId,
    item_name,
    inventoryId,
    quantity,
    sagaId,
    typeMoviment,
  }: InventoryTransactionHistory) {
    const transaction = new InventoryTransactionHistory({
      itemId,
      item_name,
      inventoryId,
      quantity,
      sagaId,
      typeMoviment,
      createdAt: new Date(),
    });

    return transaction;
  }
}
