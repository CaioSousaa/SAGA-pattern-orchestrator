import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { UseCasesModule } from 'src/usecases/usecases.module';

@Module({
  imports: [ConfigModule.forRoot(), CqrsModule.forRoot(), UseCasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
