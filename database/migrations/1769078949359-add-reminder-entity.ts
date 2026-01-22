import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReminderEntity1769078949359 implements MigrationInterface {
    name = 'AddReminderEntity1769078949359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_62fe3254bbe46f9c1ac11f306b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e41b7bec6393d5e4f2c4e5751"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7be490f596a7e27890b7dfea13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b295e31d12e71f9b2b72fd4308"`);
        await queryRunner.query(`CREATE TYPE "public"."reminders_frequency_enum" AS ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`CREATE TABLE "reminders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "title" character varying(160) NOT NULL, "amount" numeric(14,2), "currency" character(3), "due_date" date NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "frequency" "public"."reminders_frequency_enum" NOT NULL DEFAULT 'NONE', "next_remind_at" TIMESTAMP WITH TIME ZONE, "last_sent_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "debt_id" uuid, "bill_id" uuid, "expense_id" uuid, "group_invoice_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_c879986b919d774112ab784071" UNIQUE ("debt_id"), CONSTRAINT "REL_ebc6d94c34a91cc68fe6d23bc3" UNIQUE ("bill_id"), CONSTRAINT "REL_aacb4427b212de320f6ee6a9c7" UNIQUE ("expense_id"), CONSTRAINT "REL_d3342585958932ead115a6a97b" UNIQUE ("group_invoice_id"), CONSTRAINT "PK_38715fec7f634b72c6cf7ea4893" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b376d9398cb776de484a07902f" ON "reminders" ("frequency") `);
        await queryRunner.query(`CREATE INDEX "IDX_25f11513e658203bcc2a49d2ba" ON "reminders" ("is_active", "next_remind_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a264ef46ca953b2cf280b34b0" ON "reminders" ("user_id", "is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_0dc66122b2768f4aed95f4391c" ON "reminders" ("user_id", "due_date") `);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "reminder_enabled"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "reminder_frequency"`);
        await queryRunner.query(`DROP TYPE "public"."bills_reminder_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "reminder_enabled"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "reminder_frequency"`);
        await queryRunner.query(`DROP TYPE "public"."expenses_reminder_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "group_invoices" DROP COLUMN "reminder_enabled"`);
        await queryRunner.query(`ALTER TABLE "group_invoices" DROP COLUMN "reminder_frequency"`);
        await queryRunner.query(`DROP TYPE "public"."group_invoices_reminder_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_586e0b8e419125be507701cee2a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_c879986b919d774112ab7840713" FOREIGN KEY ("debt_id") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_ebc6d94c34a91cc68fe6d23bc3a" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_aacb4427b212de320f6ee6a9c78" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_d3342585958932ead115a6a97bd" FOREIGN KEY ("group_invoice_id") REFERENCES "group_invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_d3342585958932ead115a6a97bd"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_aacb4427b212de320f6ee6a9c78"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_ebc6d94c34a91cc68fe6d23bc3a"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_c879986b919d774112ab7840713"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_586e0b8e419125be507701cee2a"`);
        await queryRunner.query(`CREATE TYPE "public"."group_invoices_reminder_frequency_enum" AS ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`ALTER TABLE "group_invoices" ADD "reminder_frequency" "public"."group_invoices_reminder_frequency_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "group_invoices" ADD "reminder_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."expenses_reminder_frequency_enum" AS ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "reminder_frequency" "public"."expenses_reminder_frequency_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "reminder_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."bills_reminder_frequency_enum" AS ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "reminder_frequency" "public"."bills_reminder_frequency_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "reminder_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dc66122b2768f4aed95f4391c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a264ef46ca953b2cf280b34b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25f11513e658203bcc2a49d2ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b376d9398cb776de484a07902f"`);
        await queryRunner.query(`DROP TABLE "reminders"`);
        await queryRunner.query(`DROP TYPE "public"."reminders_frequency_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_b295e31d12e71f9b2b72fd4308" ON "debts" ("remind_at", "reminder_enabled") `);
        await queryRunner.query(`CREATE INDEX "IDX_7be490f596a7e27890b7dfea13" ON "group_invoices" ("next_remind_at", "reminder_enabled") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e41b7bec6393d5e4f2c4e5751" ON "expenses" ("next_remind_at", "reminder_enabled") `);
        await queryRunner.query(`CREATE INDEX "IDX_62fe3254bbe46f9c1ac11f306b" ON "bills" ("next_remind_at", "reminder_enabled") `);
    }

}
