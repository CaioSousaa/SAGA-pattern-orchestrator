import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UseCasesModule } from 'src/usecases/usecases.module';

@Module({
  imports: [ConfigModule.forRoot(), UseCasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
