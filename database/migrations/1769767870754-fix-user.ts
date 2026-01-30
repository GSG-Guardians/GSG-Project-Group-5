import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUser1769767870754 implements MigrationInterface {
  name = 'FixUser1769767870754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_3de0c7b73e7afd5f257d4a92cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "default_currency_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_3de0c7b73e7afd5f257d4a92cae" FOREIGN KEY ("default_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_3de0c7b73e7afd5f257d4a92cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "default_currency_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_3de0c7b73e7afd5f257d4a92cae" FOREIGN KEY ("default_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
