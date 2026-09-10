import { BaseEntity } from 'src/configs/database/base.entity';
import { decimalColumn } from 'src/shared/utils/decimal-column.transformer';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductOptionValue } from './product-option-value.entity';

@Entity('product_variants')
// Partial unique index: chỉ enforce unique barcode khi barcode IS NOT NULL
@Index('uq_variant_barcode', ['barcode'], {
  unique: true,
  where: '"barcode" IS NOT NULL',
})
// Partial index: chỉ index variant đang bị tắt để query nhanh hơn
@Index('idx_variant_inactive', ['isActive'], { where: '"is_active" = false' })
export class ProductVariant extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  /** SKU là định danh duy nhất của một variant */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string | null;

  @Column(decimalColumn)
  price: number;

  @Column(decimalColumn)
  compareAtPrice: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  /** Cảnh báo khi số lượng tồn kho thấp hơn ngưỡng này */
  @Column({ type: 'int', default: 0 })
  lowStockThreshold: number;

  @Column({ ...decimalColumn, default: 1 })
  weight: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string | null;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  imageId: string | null;

  @ManyToOne(() => ProductImage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: ProductImage | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToMany(() => ProductOptionValue, (optionValue) => optionValue.variants)
  @JoinTable({
    name: 'variant_option_values',
    joinColumn: {
      name: 'variant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'option_value_id',
      referencedColumnName: 'id',
    },
  })
  optionValues: ProductOptionValue[];
}
