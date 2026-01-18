import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export const AppDataSource = {
    useFactory: (configService: ConfigService) => (new DataSource({
        type: "postgres",
        url: configService.getOrThrow<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: ["dist/**/*.entity.js"],
        migrations: ["dist/database/migrations/*.js"],
        synchronize: false,
    })),
    inject: [ConfigService],
}