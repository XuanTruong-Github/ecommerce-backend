import { Product } from 'src/app/product/entities/product.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('product_images')
@Index('uq_primary_image_per_product', ['productId'], {
  unique: true,
  where: '"is_primary" = true',
})
export class ProductImage extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({
    type: 'uuid',
    nullable: true,
  })
  variantId: string | null;

  @Column({
    type: 'text',
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  alt: string | null;

  @Column({
    type: 'int',
    default: 0,
  })
  displayOrder: number;

  @Index()
  @Column({
    type: 'boolean',
    default: false,
  })
  isPrimary: boolean;
}
