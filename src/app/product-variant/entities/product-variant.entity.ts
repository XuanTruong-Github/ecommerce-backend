import { Product } from 'src/app/product/entities/product.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import { decimalColumn } from 'src/shared/utils/decimal-column.transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  sku: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  barcode?: string;

  @Column(decimalColumn)
  price: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;
}
