import 'reflect-metadata';
import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  HttpExceptionFilter,
  TypeOrmExceptionFilter,
  UncaughtExceptionFilter,
  ZodExceptionFilter,
} from '../src/error/exception.filter';

let cachedServer: any;

async function bootstrap() {
  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  nestApp.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  nestApp.use(cookieParser());
  nestApp.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Trackly API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('docs', nestApp, document, {
    useGlobalPrefix: true,
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });

  nestApp.useGlobalFilters(
    new HttpExceptionFilter(),
    new ZodExceptionFilter(),
    new TypeOrmExceptionFilter(),
    new UncaughtExceptionFilter(),
  );

  await nestApp.init();

  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  return cachedServer(req, res);
}
