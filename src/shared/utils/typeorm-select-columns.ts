import { FindOptionsSelect, ObjectLiteral, Repository } from 'typeorm';

/**
 * Chọn TẤT CẢ các cột của Entity NGOẠI TRỪ các cột được truyền vào `excludes`.
 * TypeScript sẽ tự động gợi ý tên các cột của Entity khi bạn gõ.
 *
 * @example
 * const select = excludeColumns(this.productRepository, ['descriptionHtml', 'metafields']);
 * // Kết quả: { id: true, title: true, handle: true, ... }
 */
export function excludeColumns<Entity extends ObjectLiteral>(
  repo: Repository<Entity>,
  excludes: (keyof Entity)[] = [],
): FindOptionsSelect<Entity> {
  const entityMetadata = repo.metadata;
  const select = {} as FindOptionsSelect<Entity>;
  const excludeSet = new Set<string>(excludes as string[]);

  for (const column of entityMetadata.columns) {
    if (!excludeSet.has(column.propertyName)) {
      (select as Record<string, boolean>)[column.propertyName] = true;
    }
  }

  return select;
}

/**
 * CHỈ CHỌN các cột được truyền vào `includes`.
 * TypeScript sẽ tự động gợi ý tên các cột của Entity khi bạn gõ.
 *
 * @example
 * const select = includeColumns(this.productRepository, ['id', 'title', 'price', 'status']);
 * // Kết quả: { id: true, title: true, price: true, status: true }
 */
export function includeColumns<Entity extends ObjectLiteral>(
  repo: Repository<Entity>,
  includes: (keyof Entity)[] = [],
): FindOptionsSelect<Entity> {
  const select = {} as FindOptionsSelect<Entity>;

  for (const col of includes) {
    (select as Record<string, boolean>)[col as string] = true;
  }

  return select;
}
