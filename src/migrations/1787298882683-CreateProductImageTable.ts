import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductImageTable1787298882683 implements MigrationInterface {
    name = 'CreateProductImageTable1787298882683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "variant_id" uuid, "url" text NOT NULL, "alt" character varying(255), "display_order" integer NOT NULL DEFAULT '0', "is_primary" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f166bb8c2bfcef2498d97b406" ON "product_images"  ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7645bd68229997627f7b219168" ON "product_images"  ("variant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_40c8197808bffd4ac9919d8cdd" ON "product_images"  ("is_primary") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_primary_image_per_product" ON "product_images"  ("product_id") WHERE "is_primary" = true`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`DROP INDEX "public"."uq_primary_image_per_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40c8197808bffd4ac9919d8cdd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7645bd68229997627f7b219168"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f166bb8c2bfcef2498d97b406"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}
