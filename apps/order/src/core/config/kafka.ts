import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-micro',
  brokers: ['localhost:9092'],
});

export { kafka };
