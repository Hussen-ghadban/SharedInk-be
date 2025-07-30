import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:5173', // Allow frontend
    credentials: true,              // If you're using cookies or Authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
