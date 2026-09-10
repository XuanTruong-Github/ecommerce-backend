import { BaseEntity } from 'src/configs/database/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  RelationId,
  Unique,
} from 'typeorm';
import { ProductOption } from './product-option.entity';
import { decimalColumnNullable } from 'src/shared/utils/decimal-column.transformer';
import { ProductVariant } from './product-variant.entity';

@Entity('product_option_values')
@Unique('uq_option_value', ['option', 'value'])
export class ProductOptionValue extends BaseEntity {
  @RelationId((pov: ProductOptionValue) => pov.option)
  optionId: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  value: string;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column(decimalColumnNullable)
  priceModifier: number | null;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @ManyToOne(() => ProductOption, (option) => option.values, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductOption;

  @ManyToMany(() => ProductVariant, (variant) => variant.optionValues)
  variants: ProductVariant[];
}
