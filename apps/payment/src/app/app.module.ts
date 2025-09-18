import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from 'src/modules/payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot(), PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
