import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'debug'],
    cors: false,
  });

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port!);
}
bootstrap();
