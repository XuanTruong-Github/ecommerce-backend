import { BaseEntity } from 'src/configs/database/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOptionValue } from './product-option-value.entity';

export enum OptionType {
  COLOR = 'color',
  TEXT = 'text',
}

@Entity('product_options')
// Unique: một product không thể có 2 option trùng tên
@Index(['productId', 'name'], { unique: true })
// Unique: position phải unique theo product để tránh collision khi sort
@Index(['productId', 'position'], { unique: true })
export class ProductOption extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'smallint', default: 0 })
  position: number;

  // FK index: tăng tốc JOIN / WHERE product_id = ?
  @Index()
  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ type: 'enum', enum: OptionType, default: OptionType.TEXT })
  type: OptionType;

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  values: ProductOptionValue[];

  @ManyToOne(() => Product, (product) => product.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
