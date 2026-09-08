import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1788860652662 implements MigrationInterface {
    name = 'InitDatabase1788860652662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer', 'unregister')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "image" text, "phone" text, "date_of_birth" date, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'other', "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "address_line1" text NOT NULL, "address_line2" text, "country_code" text NOT NULL, "state_code" text NOT NULL, "city" text NOT NULL, "postal_code" text NOT NULL, "phone" character varying(20) NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16aac8a9f6f9c1dd6bcb75ec02" ON "addresses"  ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_default_address" ON "addresses"  ("user_id") WHERE "is_default" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "issuer" text NOT NULL, "account_id" text NOT NULL, "provider_id" text NOT NULL, "access_token" text, "refresh_token" text, "access_token_expires_at" TIMESTAMP WITH TIME ZONE, "refresh_token_expires_at" TIMESTAMP WITH TIME ZONE, "scope" text, "id_token" text, "password" text, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3000dad1da61b29953f0747632" ON "accounts"  ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_44a04eea9fec2b45dd3e6d0476" ON "accounts"  ("issuer", "account_id") `);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "token" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ip_address" text, "user_agent" text, CONSTRAINT "UQ_e9f62f5dcb8a54b84234c9e7a06" UNIQUE ("token"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_085d540d9f418cfbdc7bd55bb1" ON "sessions"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9cfe37d28c3b229a350e086d94" ON "sessions"  ("expires_at") `);
        await queryRunner.query(`CREATE TABLE "verifications" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "identifier" text NOT NULL, "value" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_2127ad1b143cf012280390b01d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b1d33a8992164b361ad932e899" ON "verifications"  ("identifier") `);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "image_url" text, "parent_id" uuid, "display_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88cea2dc9c31951d06437879b4" ON "categories"  ("parent_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9ac726b26f9d0f50f843742e6" ON "categories"  ("display_order") `);
        await queryRunner.query(`CREATE INDEX "IDX_083b4657d537e819d86961f4aa" ON "categories"  ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_a184f5dd6c131f01b9f48968f0" ON "categories"  ("deleted_at") `);
        await queryRunner.query(`CREATE TYPE "public"."coupons_discount_type_enum" AS ENUM('percentage', 'fixed_amount')`);
        await queryRunner.query(`CREATE TABLE "coupons" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(255) NOT NULL, "description" text, "discount_type" "public"."coupons_discount_type_enum" NOT NULL DEFAULT 'percentage', "discount_value" numeric(18,2) NOT NULL, "min_order_amount" numeric(18,2) NOT NULL DEFAULT '0', "max_discount_amount" numeric(18,2), "usage_limit" integer, "usage_limit_per_user" integer, "used_count" integer NOT NULL DEFAULT '0', "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL, "valid_until" TIMESTAMP WITH TIME ZONE NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e025109230e82925843f2a14c48" UNIQUE ("code"), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e025109230e82925843f2a14c4" ON "coupons"  ("code") `);
        await queryRunner.query(`CREATE INDEX "idx_coupon_valid" ON "coupons"  ("valid_from", "valid_until") `);
        await queryRunner.query(`CREATE INDEX "idx_coupon_active" ON "coupons"  ("is_active") WHERE "is_active" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, "name" text NOT NULL, "slug" text NOT NULL, "short_description" text, "description" text, "price" numeric(18,2) NOT NULL, "compare_at_price" numeric(18,2), "stock_quantity" integer NOT NULL DEFAULT '0', "sku" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_featured" boolean NOT NULL DEFAULT false, "view_count" integer NOT NULL DEFAULT '0', "rating_average" numeric(3,2) NOT NULL, "review_count" integer NOT NULL DEFAULT '0', "has_variants" boolean NOT NULL DEFAULT false, "weight" numeric(18,2), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f6868c96e0069e699f33e12" ON "products"  ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_464f927ae360106b783ed0b410" ON "products"  ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_c44ac33a05b144dd0d9ddcf932" ON "products"  ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_4dcd2cd0cf988da1681469a0f4" ON "products"  ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9f41b424daf5586e649363c18" ON "products"  ("has_variants") `);
        await queryRunner.query(`CREATE INDEX "IDX_718dfbc007ec098cfa28295ca7" ON "products"  ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "idx_product_featured" ON "products"  ("is_featured") WHERE "is_featured" = true AND "deleted_at" IS NULL AND "is_active" = true`);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "variant_id" uuid, "url" text NOT NULL, "alt" character varying(255), "display_order" integer NOT NULL DEFAULT '0', "is_primary" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f166bb8c2bfcef2498d97b406" ON "product_images"  ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7645bd68229997627f7b219168" ON "product_images"  ("variant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_40c8197808bffd4ac9919d8cdd" ON "product_images"  ("is_primary") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_primary_image_per_product" ON "product_images"  ("product_id") WHERE "is_primary" = true`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`DROP INDEX "public"."uq_primary_image_per_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40c8197808bffd4ac9919d8cdd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7645bd68229997627f7b219168"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f166bb8c2bfcef2498d97b406"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_featured"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_718dfbc007ec098cfa28295ca7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f41b424daf5586e649363c18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dcd2cd0cf988da1681469a0f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c44ac33a05b144dd0d9ddcf932"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_464f927ae360106b783ed0b410"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f6868c96e0069e699f33e12"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."idx_coupon_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_coupon_valid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e025109230e82925843f2a14c4"`);
        await queryRunner.query(`DROP TABLE "coupons"`);
        await queryRunner.query(`DROP TYPE "public"."coupons_discount_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a184f5dd6c131f01b9f48968f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_083b4657d537e819d86961f4aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9ac726b26f9d0f50f843742e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88cea2dc9c31951d06437879b4"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1d33a8992164b361ad932e899"`);
        await queryRunner.query(`DROP TABLE "verifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cfe37d28c3b229a350e086d94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_085d540d9f418cfbdc7bd55bb1"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44a04eea9fec2b45dd3e6d0476"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3000dad1da61b29953f0747632"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP INDEX "public"."user_default_address"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16aac8a9f6f9c1dd6bcb75ec02"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    }

}
