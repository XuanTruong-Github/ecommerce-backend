import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, DeleteDateColumn, Entity, Index, OneToMany } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

export interface Seo {
  title?: string;
  description?: string;
}

@Entity('products')
export class Product extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  handle: string;

  @Column({ type: 'text', nullable: true })
  descriptionHtml: string | null;

  @Column({ nullable: true })
  vendor: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  productType: string | null;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Index()
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @Column({ type: 'jsonb', default: {} })
  metafields: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  hasOnlyDefaultVariant: boolean;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'::jsonb" })
  seo: Seo | null;

  @OneToMany(() => ProductOption, (option) => option.product, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  options: ProductOption[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  variants: ProductVariant[];

  @Index()
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
