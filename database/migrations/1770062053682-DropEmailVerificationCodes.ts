import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropEmailVerificationCodes1770062053682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_verification_codes', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op or recreate if needed, but since it's a duplication cleanup, we likely won't revert this restoration.
    // For safety, leaving it empty or adding a comment.
  }
}
