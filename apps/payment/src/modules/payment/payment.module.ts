import { Module } from '@nestjs/common';
import { ValidatePaymentService } from './services/ValidatePayment.service';
import { PaymentPrismarRepository } from './infra/prisma/repositories/PaymentPrismaRepository';
import { CustomerPrismarRepository } from '../customer/infra/prisma/repositories/CustomerPrismaRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ValidatePaymentService,
    PaymentPrismarRepository,
    CustomerPrismarRepository,
  ],
})
export class PaymentModule {}
