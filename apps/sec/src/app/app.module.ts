import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SagaModule } from 'src/modules/saga/saga.module';

@Module({
  imports: [ConfigModule.forRoot(), CqrsModule.forRoot(), SagaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
