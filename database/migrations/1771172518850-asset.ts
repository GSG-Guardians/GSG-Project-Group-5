import { MigrationInterface, QueryRunner } from 'typeorm';

export class Asset1771172518850 implements MigrationInterface {
  name = 'Asset1771172518850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "file_id" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."income_recurring_rules_frequency_enum" RENAME TO "income_recurring_rules_frequency_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."income_recurring_rules_frequency_enum" AS ENUM('ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" TYPE "public"."income_recurring_rules_frequency_enum" USING "frequency"::"text"::"public"."income_recurring_rules_frequency_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" SET DEFAULT 'ONE_TIME'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."income_recurring_rules_frequency_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."income_recurring_rules_frequency_enum_old" AS ENUM('ONE_TIME', 'WEEKLY', 'MONTHLY', 'YEARLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" TYPE "public"."income_recurring_rules_frequency_enum_old" USING "frequency"::"text"::"public"."income_recurring_rules_frequency_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ALTER COLUMN "frequency" SET DEFAULT 'ONE_TIME'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."income_recurring_rules_frequency_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."income_recurring_rules_frequency_enum_old" RENAME TO "income_recurring_rules_frequency_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "file_id"`);
  }
}
