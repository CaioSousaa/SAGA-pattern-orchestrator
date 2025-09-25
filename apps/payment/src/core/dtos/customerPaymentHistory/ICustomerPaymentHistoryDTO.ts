export interface ICustomerPaymentHistoryDTO {
  customerId: string;
  paymentId: number;
  balanceAfterPayment: number;
  totalPayable: number;
  sagaId: string;
}
