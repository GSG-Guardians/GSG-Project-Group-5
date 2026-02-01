import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app;

export default async function handler(req, res) {
    console.log('Serverless Handler Invoked');
    try {
        if (!app) {
            app = await NestFactory.create(AppModule);
            app.setGlobalPrefix('api');
            app.enableCors();
            await app.init();
        }
        const instance = app.getHttpAdapter().getInstance();
        return instance(req, res);
    } catch (error) {
        console.error('Serverless Bootstrap Error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            message: 'Critical error during serverless bootstrap',
            error: error.message || error.toString(),
            stack: error.stack,
            env: {
                DATABASE_URL_DEFINED: !!process.env.DATABASE_URL
            }
        }));
    }
}
