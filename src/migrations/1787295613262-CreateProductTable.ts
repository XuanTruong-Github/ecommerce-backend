import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1787295613262 implements MigrationInterface {
    name = 'CreateProductTable1787295613262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, "name" text NOT NULL, "slug" text NOT NULL, "short_description" text, "description" text, "price" numeric(18,2) NOT NULL, "compare_at_price" numeric(18,2), "stock_quantity" integer NOT NULL DEFAULT '0', "sku" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_featured" boolean NOT NULL DEFAULT false, "view_count" integer NOT NULL DEFAULT '0', "rating_average" numeric(3,2) NOT NULL, "review_count" integer NOT NULL DEFAULT '0', "has_variants" boolean NOT NULL DEFAULT false, "weight" numeric(18,2), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f6868c96e0069e699f33e12" ON "products"  ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_464f927ae360106b783ed0b410" ON "products"  ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_c44ac33a05b144dd0d9ddcf932" ON "products"  ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_4dcd2cd0cf988da1681469a0f4" ON "products"  ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9f41b424daf5586e649363c18" ON "products"  ("has_variants") `);
        await queryRunner.query(`CREATE INDEX "IDX_718dfbc007ec098cfa28295ca7" ON "products"  ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "idx_product_featured" ON "products"  ("is_featured") WHERE "is_featured" = true AND "deleted_at" IS NULL AND "is_active" = true`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_featured"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_718dfbc007ec098cfa28295ca7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f41b424daf5586e649363c18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dcd2cd0cf988da1681469a0f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c44ac33a05b144dd0d9ddcf932"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_464f927ae360106b783ed0b410"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f6868c96e0069e699f33e12"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
