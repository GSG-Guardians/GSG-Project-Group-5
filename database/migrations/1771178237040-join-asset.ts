import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinAsset1771178237040 implements MigrationInterface {
  name = 'JoinAsset1771178237040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assets" DROP CONSTRAINT "FK_d8cf9bdec7d2fad0852aec349c1"`,
    );
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_95e68ec694262926f1af7176a1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assets" DROP CONSTRAINT "FK_95e68ec694262926f1af7176a1e"`,
    );
    await queryRunner.query(`ALTER TABLE "assets" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_d8cf9bdec7d2fad0852aec349c1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
