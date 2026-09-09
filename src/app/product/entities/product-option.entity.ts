import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { ProductOptionValue } from './product-option-value.entity';

export enum ProductOptionType {
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

  @Index()
  @Column({ type: 'enum', enum: ProductOptionType, default: ProductOptionType.TEXT })
  type: ProductOptionType;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.productOption)
  values: ProductOptionValue[];
}
