import { InventoryTransactionHistory } from 'src/core/domain/entities/InventoryTransactionHistory';
import { ICreateInventoryTransactionHistoryDTO } from 'src/core/dtos/inventoryTransactionHistory/ICreateInventoryTransactionHistoryDTO';

export interface IInventoryTransactionHistoryRepositoryPort {
  create(
    data: ICreateInventoryTransactionHistoryDTO,
  ): Promise<InventoryTransactionHistory>;

  findBySagaId(sagaId: string): Promise<InventoryTransactionHistory | null>;
}
