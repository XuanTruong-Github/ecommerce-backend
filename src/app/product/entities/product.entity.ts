import { Category } from 'src/app/category/entities/category.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import {
  decimalColumn,
  decimalColumnNullable,
  decimalColumnTransformer,
} from 'src/shared/utils/decimal-column.transformer';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('products')
@Index('idx_product_featured', ['isFeatured'], {
  where: '"is_featured" = true AND "deleted_at" IS NULL AND "is_active" = true',
})
export class Product extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  categoryId: string;
  //   Relations
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

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
  shortDescription: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column(decimalColumn)
  price: number;

  @Column(decimalColumnNullable)
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
  })
  ratingAverage: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Index()
  @Column({ default: false })
  hasVariants: boolean;

  @Column(decimalColumnNullable)
  weight: number;

  @Index()
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
