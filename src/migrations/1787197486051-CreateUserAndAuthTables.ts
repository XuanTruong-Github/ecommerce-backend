import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndAuthTables1787197486051 implements MigrationInterface {
    name = 'CreateUserAndAuthTables1787197486051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer', 'unregister')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "image" text, "phone" text, "date_of_birth" date, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'other', "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "account_id" text NOT NULL, "provider_id" text NOT NULL, "access_token" text, "refresh_token" text, "access_token_expires_at" TIMESTAMP WITH TIME ZONE, "refresh_token_expires_at" TIMESTAMP WITH TIME ZONE, "scope" text, "id_token" text, "password" text, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3000dad1da61b29953f0747632" ON "accounts"  ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b5cfc47b024d4703ef783ee2f4" ON "accounts"  ("provider_id", "account_id") `);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "token" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ip_address" text, "user_agent" text, CONSTRAINT "UQ_e9f62f5dcb8a54b84234c9e7a06" UNIQUE ("token"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_085d540d9f418cfbdc7bd55bb1" ON "sessions"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9cfe37d28c3b229a350e086d94" ON "sessions"  ("expires_at") `);
        await queryRunner.query(`CREATE TABLE "verifications" ("id" uuid NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "identifier" text NOT NULL, "value" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_2127ad1b143cf012280390b01d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`DROP TABLE "verifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cfe37d28c3b229a350e086d94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_085d540d9f418cfbdc7bd55bb1"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5cfc47b024d4703ef783ee2f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3000dad1da61b29953f0747632"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    }

}
