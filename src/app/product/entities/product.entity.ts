import { Category } from 'src/app/category/entities/category.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import {
  decimalColumn,
  decimalColumnNullable,
  decimalColumnTransformer,
} from 'src/shared/utils/decimal-column.transformer';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
@Index('idx_product_featured', ['isFeatured'], {
  where: '"is_featured" = true AND "deleted_at" IS NULL AND "is_active" = true',
})
export class Product extends BaseEntity {
  @Index()
  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;
  //   Relations
  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;

  @Column({
    type: 'text',
  })
  name: string;

  @Index()
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  shortDescription: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({ ...decimalColumn, default: 0 })
  price: number;

  @Column({ ...decimalColumn, default: 0 })
  compareAtPrice: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stockQuantity: number;

  @Index()
  @Column({
    unique: true,
  })
  sku: string;

  @Index()
  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: false,
  })
  isFeatured: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    transformer: decimalColumnTransformer,
    default: 0,
  })
  ratingAverage: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Index()
  @Column({ default: false })
  hasVariants: boolean;

  @Column(decimalColumnNullable)
  weight: number | null;

  @OneToMany(() => ProductOption, (option) => option.product, {
    cascade: ['insert', 'update'],
  })
  options: ProductOption[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: ['insert', 'update'],
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: ['insert', 'update'],
  })
  images: ProductImage[];

  @Index()
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
