import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index } from 'typeorm';

enum ProductOptionType {
  COLOR = 'color',
  SIZE = 'size',
  TEXT = 'text',
  CUSTOM = 'custom',
}

@Entity('product_options')
export class ProductOption extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'enum', enum: ProductOptionType, default: ProductOptionType.TEXT })
  type: ProductOptionType;
}
