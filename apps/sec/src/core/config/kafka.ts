import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'saga-create-order',
  brokers: ['localhost:9092'],
});

export { kafka };
