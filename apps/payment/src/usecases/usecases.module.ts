import { Module } from '@nestjs/common';
import { ValidatePaymentService } from './ValidatePayment.service';
import { PaymentPrismarRepository } from 'src/infra/prisma/repositories/PaymentPrismaRepository';
import { CustomerPrismarRepository } from 'src/infra/prisma/repositories/CustomerPrismaRepository';
import { CustomerPaymentHistoryPrismaRepository } from 'src/infra/prisma/repositories/CustomerPaymentHistoryPrismaRepository';
import { CompensationPaymentService } from './CompensationPayment.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ValidatePaymentService,
    PaymentPrismarRepository,
    CustomerPrismarRepository,
    CompensationPaymentService,
    CustomerPaymentHistoryPrismaRepository,
  ],
})
export class UseCasesModule {}
