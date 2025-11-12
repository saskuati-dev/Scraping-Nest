import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true, //['http://localhost:3000', 
     // process.env.FRONTEND_URL || '*'],
      credentials: true

  });

  app.useGlobalPipes(new ValidationPipe());

  // 🔥 Use a porta definida pelo Render (ou 3001 localmente)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
