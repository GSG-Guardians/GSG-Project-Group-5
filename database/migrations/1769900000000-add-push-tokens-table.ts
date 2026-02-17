import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPushTokensTable1769900000000 implements MigrationInterface {
  name = 'AddPushTokensTable1769900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "push_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying(512) NOT NULL, "platform" character varying(20) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "last_seen_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_push_tokens_token" UNIQUE ("token"), CONSTRAINT "PK_push_tokens_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_push_tokens_user_id_is_active" ON "push_tokens" ("user_id", "is_active") `,
    );
    await queryRunner.query(
      `ALTER TABLE "push_tokens" ADD CONSTRAINT "FK_push_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_push_tokens_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_push_tokens_user_id_is_active"`,
    );
    await queryRunner.query(`DROP TABLE "push_tokens"`);
  }
}
