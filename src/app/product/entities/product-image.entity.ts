import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  alt: string | null;

  @Column({ type: 'int', default: 0 })
  position: number;

  /**
   * Đánh dấu ảnh chính của product.
   * Partial Unique Index được tạo thủ công trong migration:
   *   CREATE UNIQUE INDEX "UQ_product_images_primary"
   *     ON "product_images" ("product_id")
   *     WHERE "is_primary" = TRUE;
   * Điều này đảm bảo chỉ có đúng 1 ảnh isPrimary=true cho mỗi product.
   */
  @Index()
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  // FK index: tăng tốc JOIN / WHERE product_id = ?
  @Index()
  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
