import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 9000, () => {
    console.log('[ORCHESTRADOR SEC MICROSERVICE RUN IN PORT 9000]');
  });
}
bootstrap();
