import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const frontendUrl = process.env['FRONTEND_URL'] || 'http://web';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  const port = Number.parseInt(process.env['API_PORT'] || '3000', 10);
  await app.listen(port);
  Logger.log(`Application is running on port ${port}`);
  Logger.log(`Allowed frontend origin: ${frontendUrl}`);
}

bootstrap();
