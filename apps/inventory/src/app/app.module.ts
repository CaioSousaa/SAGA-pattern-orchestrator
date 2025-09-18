import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovimentModule } from 'src/modules/moviment/moviment.module';

@Module({
  imports: [ConfigModule.forRoot(), MovimentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
