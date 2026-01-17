import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);

  const SwaggerConfig = new DocumentBuilder()
    .setTitle('Security app API') // عنوان الواجهة
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000', 'Local development server') //يعني الطلبات بتنبعت على هادا السيرفر
    .addServer('https://nosoor-production.up.railway.app') // Production
    .setVersion('1.0')
    .addTag('Security App') //تصنيف عام لل API
    .addBearerAuth()
    .build();
  //Instantiate Document
  const document = SwaggerModule.createDocument(app, SwaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  console.log('app started on 3000');
}
void bootstrap();
