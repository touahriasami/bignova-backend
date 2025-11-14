import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // app.useGlobalGuards()

  app.setGlobalPrefix('/api');

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://bignova.smartstack-solutions.com',
      'https://bignova.smartstack-solutions.com',
    ],
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Saas Invoices API')
    .setDescription('BigNova Test')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter your Bearer token',
      in: 'header',
    })
    .setBasePath('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
