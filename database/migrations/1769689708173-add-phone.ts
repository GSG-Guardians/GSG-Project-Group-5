import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhone1769689708173 implements MigrationInterface {
    name = 'AddPhone1769689708173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "financial_insight" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "insight_type" character varying(50) NOT NULL, "title" character varying(200) NOT NULL, "message" text NOT NULL, "period_start" date NOT NULL, "period_end" date NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_14dc08ade9282d431949ec42833" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."budget_category_enum" AS ENUM('FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'HEALTH', 'SHOPPING', 'OTHERS')`);
        await queryRunner.query(`CREATE TABLE "budget" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" "public"."budget_category_enum" NOT NULL, "allocated_amount" numeric(12,2) NOT NULL, "spent_amount" numeric(12,2) NOT NULL DEFAULT '0', "start_date" date NOT NULL, "end_date" date NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "notes" text, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`);
        await queryRunner.query(`CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`ALTER TABLE "financial_insight" ADD CONSTRAINT "FK_2f9fbba840f23bce3598504f49d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_68df09bd8001a1fb0667a9b42f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_68df09bd8001a1fb0667a9b42f7"`);
        await queryRunner.query(`ALTER TABLE "financial_insight" DROP CONSTRAINT "FK_2f9fbba840f23bce3598504f49d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP TABLE "budget"`);
        await queryRunner.query(`DROP TYPE "public"."budget_category_enum"`);
        await queryRunner.query(`DROP TABLE "financial_insight"`);
    }

}
