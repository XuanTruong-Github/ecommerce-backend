import { BaseEntity } from 'src/configs/database/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { decimalColumn, decimalColumnNullable } from 'src/shared/utils/decimal-column.transformer';
import { ProductImage } from './product-image.entity';
import { ProductOptionValue } from './product-option-value.entity';
import { ProductReview } from './product-review.entity';

@Entity('product_variants')
// Composite index: Tối ưu cho query lấy variants của 1 product và filter/sort theo giá
@Index(['productId', 'price'])
export class ProductVariant extends BaseEntity {
  // FK index: tăng tốc JOIN và filter WHERE product_id = ?
  @Index()
  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;
  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  sku: string | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  barcode: string | null;

  @Column(decimalColumn)
  price: number;

  @Column(decimalColumnNullable)
  compareAtPrice: number | null;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  lowStockThreshold: number;

  // FK index: tăng tốc JOIN và ON DELETE SET NULL khi xóa image
  @Index()
  @Column({ type: 'uuid', name: 'image_id', nullable: true })
  imageId: string | null;

  @ManyToOne(() => ProductImage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ProductImage | null;

  @ManyToMany(() => ProductOptionValue, (optionValue) => optionValue.variants, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'product_variant_option_values',
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

  @OneToMany(() => ProductReview, (review) => review.variant)
  reviews: ProductReview[];
}
