import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://192.168.100.11:4200',
      'http://192.168.100.17:4200',
      'http://192.168.100.16:4200',
      //'http://192.168.100.22:4200',
    ],
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  console.log('port',process.env.PORT);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
