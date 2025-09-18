import { Module } from '@nestjs/common';
import { ValidatePaymentService } from './ValidatePayment.service';
import { PaymentPrismarRepository } from 'src/infra/prisma/repositories/PaymentPrismaRepository';
import { CustomerPrismarRepository } from 'src/infra/prisma/repositories/CustomerPrismaRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ValidatePaymentService,
    PaymentPrismarRepository,
    CustomerPrismarRepository,
  ],
})
export class UseCasesModule {}
