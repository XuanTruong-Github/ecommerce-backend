import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId, Unique } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { decimalColumnNullable } from 'src/shared/utils/decimal-column.transformer';

@Entity('product_option_values')
@Unique('uq_option_value', ['productOption', 'value'])
export class ProductOptionValue extends BaseEntity {
  /** FK read-only — không tạo cột riêng, lấy từ relation productOption */
  @RelationId((pov: ProductOptionValue) => pov.productOption)
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
  metadata: Record<string, any>;

  @ManyToOne(() => ProductOption, (option) => option.values, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'option_id' })
  productOption: ProductOption;
}
