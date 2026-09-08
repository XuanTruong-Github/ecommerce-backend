import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductOption1788863046697 implements MigrationInterface {
    name = 'CreateProductOption1788863046697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_options_type_enum" AS ENUM('color', 'size', 'text', 'custom')`);
        await queryRunner.query(`CREATE TABLE "product_options" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "display_order" integer NOT NULL DEFAULT '0', "type" "public"."product_options_type_enum" NOT NULL DEFAULT 'text', CONSTRAINT "PK_3916b02fb43aa725f8167c718e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_49677f87ad61a8b2a31f33c8a2" ON "product_options"  ("product_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_49677f87ad61a8b2a31f33c8a2"`);
        await queryRunner.query(`DROP TABLE "product_options"`);
        await queryRunner.query(`DROP TYPE "public"."product_options_type_enum"`);
    }

}
