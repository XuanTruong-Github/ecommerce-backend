import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdressAndCategoryTable1787217846708 implements MigrationInterface {
    name = 'CreateAdressAndCategoryTable1787217846708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "address_line1" text NOT NULL, "address_line2" text, "country_code" text NOT NULL, "state_code" text NOT NULL, "city" text NOT NULL, "postal_code" text NOT NULL, "phone" character varying(20) NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16aac8a9f6f9c1dd6bcb75ec02" ON "addresses"  ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_default_address" ON "addresses"  ("user_id") WHERE "is_default" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "image_url" text, "parent_id" uuid, "display_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88cea2dc9c31951d06437879b4" ON "categories"  ("parent_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9ac726b26f9d0f50f843742e6" ON "categories"  ("display_order") `);
        await queryRunner.query(`CREATE INDEX "IDX_083b4657d537e819d86961f4aa" ON "categories"  ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_a184f5dd6c131f01b9f48968f0" ON "categories"  ("deleted_at") `);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a184f5dd6c131f01b9f48968f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_083b4657d537e819d86961f4aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9ac726b26f9d0f50f843742e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88cea2dc9c31951d06437879b4"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP INDEX "public"."user_default_address"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16aac8a9f6f9c1dd6bcb75ec02"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
