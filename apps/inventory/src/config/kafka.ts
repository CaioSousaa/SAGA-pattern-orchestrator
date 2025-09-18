import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-micro',
  brokers: ['localhost:9092'],
});

export { kafka };
