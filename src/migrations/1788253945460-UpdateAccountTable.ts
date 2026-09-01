import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccountTable1788253945460 implements MigrationInterface {
    name = 'UpdateAccountTable1788253945460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "issuer" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "issuer"`);
    }

}
