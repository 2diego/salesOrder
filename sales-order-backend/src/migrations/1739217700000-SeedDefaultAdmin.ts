import { MigrationInterface, QueryRunner } from 'typeorm';

/** Credencial inicial documentada en .env.example — cambiar en producción. */
export class SeedDefaultAdmin1739217700000 implements MigrationInterface {
  name = 'SeedDefaultAdmin1739217700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" ("username", "email", "password_hash", "role", "name", "phone", "is_active")
      VALUES (
        'admin',
        'admin@local.dev',
        '$2b$10$JxHMNaofqzWMJoaNWxHuWOJAtNoE.175o6VCI0wKqJThouWX/gyJu',
        'admin',
        'Administrador',
        '0000000000',
        true
      )
      ON CONFLICT ("username") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "username" = 'admin'`);
  }
}
