import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('product_option_values')
// Unique: một option không thể có 2 value trùng nhau (e.g., 2 "Red" trong option "Color")
@Index(['optionId', 'value'], { unique: true })
export class ProductOptionValue extends BaseEntity {
  // FK index: tăng tốc JOIN / WHERE option_id = ?
  @Index()
  @Column({ type: 'uuid', name: 'option_id' })
  optionId: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  // Index: tăng tốc ORDER BY position khi load values theo thứ tự
  @Index()
  @Column({ type: 'smallint' })
  position: number;

  @ManyToOne(() => ProductOption, (option) => option.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductOption;

  @ManyToMany(() => ProductVariant, (variant) => variant.optionValues)
  variants: ProductVariant[];
}
