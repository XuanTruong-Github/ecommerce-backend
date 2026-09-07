import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBetterAuthSchema1788253945461 implements MigrationInterface {
  name = 'FixBetterAuthSchema1788253945461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Rename create_at -> created_at, update_at -> updated_at for all tables using BaseEntity
    const tables = [
      'users',
      'accounts',
      'sessions',
      'verifications',
      'addresses',
      'categories',
      'products',
      'product_images',
    ];
    for (const table of tables) {
      const hasCreateAt = await queryRunner.hasColumn(table, 'create_at');
      if (hasCreateAt) {
        await queryRunner.renameColumn(table, 'create_at', 'created_at');
      }
      const hasUpdateAt = await queryRunner.hasColumn(table, 'update_at');
      if (hasUpdateAt) {
        await queryRunner.renameColumn(table, 'update_at', 'updated_at');
      }
    }

    // 2. Fix accounts unique index: provider_id+account_id -> issuer+account_id
    // Drop old unique index if exists
    const accountsTable = await queryRunner.getTable('accounts');
    const oldIndex = accountsTable?.indices.find(
      (idx) => idx.name === 'IDX_b5cfc47b024d4703ef783ee2f4',
    );
    if (oldIndex) {
      await queryRunner.dropIndex('accounts', 'IDX_b5cfc47b024d4703ef783ee2f4');
    }
    // Create new unique index on (issuer, account_id) if not exists
    const hasNewIndex = accountsTable?.indices.some(
      (idx) => idx.columnNames.includes('issuer') && idx.columnNames.includes('account_id') && idx.isUnique,
    );
    if (!hasNewIndex) {
      await queryRunner.query(
        `CREATE UNIQUE INDEX "IDX_accounts_issuer_account_id" ON "accounts" ("issuer", "account_id")`,
      );
    }

    // 3. Add index on verifications.identifier to match better-auth schema (identifier indexed)
    const verificationTable = await queryRunner.getTable('verifications');
    const hasIdentifierIndex = verificationTable?.indices.some(
      (idx) => idx.columnNames.length === 1 && idx.columnNames[0] === 'identifier',
    );
    if (!hasIdentifierIndex) {
      await queryRunner.query(`CREATE INDEX "IDX_verifications_identifier" ON "verifications" ("identifier")`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert verifications identifier index
    const verificationTable = await queryRunner.getTable('verifications');
    const hasIdentifierIndex = verificationTable?.indices.some(
      (idx) => idx.name === 'IDX_verifications_identifier',
    );
    if (hasIdentifierIndex) {
      await queryRunner.dropIndex('verifications', 'IDX_verifications_identifier');
    }

    // Revert accounts unique index
    const accountsTable = await queryRunner.getTable('accounts');
    const hasNewIndex = accountsTable?.indices.some(
      (idx) => idx.name === 'IDX_accounts_issuer_account_id',
    );
    if (hasNewIndex) {
      await queryRunner.dropIndex('accounts', 'IDX_accounts_issuer_account_id');
    }
    const hasOldIndex = accountsTable?.indices.some(
      (idx) => idx.name === 'IDX_b5cfc47b024d4703ef783ee2f4',
    );
    if (!hasOldIndex) {
      await queryRunner.query(
        `CREATE UNIQUE INDEX "IDX_b5cfc47b024d4703ef783ee2f4" ON "accounts" ("provider_id", "account_id")`,
      );
    }

    // Revert rename created_at -> create_at, updated_at -> update_at
    const tables = [
      'users',
      'accounts',
      'sessions',
      'verifications',
      'addresses',
      'categories',
      'products',
      'product_images',
    ];
    for (const table of tables) {
      const hasCreatedAt = await queryRunner.hasColumn(table, 'created_at');
      if (hasCreatedAt) {
        await queryRunner.renameColumn(table, 'created_at', 'create_at');
      }
      const hasUpdatedAt = await queryRunner.hasColumn(table, 'updated_at');
      if (hasUpdatedAt) {
        await queryRunner.renameColumn(table, 'updated_at', 'update_at');
      }
    }
  }
}
