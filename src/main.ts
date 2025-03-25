import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.use('/api/uploads', express.static(join(__dirname, '..', 'uploads')));

    // ... your CORS and pipe configuration ...
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      credentials: true,
    });
    const port = process.env.PORT ?? 3000;
    console.log('Starting server on port '+port);

    // Explicitly bind to 0.0.0.0
    await app.listen(port, '0.0.0.0', () => {
      console.log('Application is running on port '+port);
    });

    

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
  
}
bootstrap();
