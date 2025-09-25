export enum SagaTopicsSent {
  INITIAL_FLOW = 'initial-flow-saga',
  SENT_PAYMENT_SUCCESS = 'sent_payment',
  SENT_INVENTORY_SUCCESS = 'sent_inventory',
  INVENTORY = 'micro-inventory',
}

export enum SagaTopicsSubscribe {
  ORDER = 'micro-order-success',
  ORDER_FAILED = 'micro-order-failed',
  PAYMENT_SUCCESS = 'micro-payment-success',
  PAYMENT_FAILED = 'micro-payment-failed',
  INVENTORY_SUCCESS = 'micro-transaction-in-inventory-success',
  INVENTORY_FAILED = 'micro-transaction-in-inventory-failed',
}
