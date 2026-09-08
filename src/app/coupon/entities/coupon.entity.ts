import { BaseEntity } from 'src/configs/database/base.entity';
import { decimalColumn, decimalColumnNullable } from 'src/shared/utils/decimal-column.transformer';
import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

@Entity('coupons')
@Index('idx_coupon_active', ['isActive'], { where: '"is_active" = true AND "deleted_at" IS NULL' })
@Index('idx_coupon_valid', ['validFrom', 'validUntil'])
export class Coupon extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
  })
  discountType: DiscountType;

  @Column(decimalColumn)
  discountValue: number;

  @Column({ ...decimalColumn, default: 0 })
  minOrderAmount: number;

  @Column(decimalColumnNullable)
  maxDiscountAmount?: number;

  @Column({ type: 'int', nullable: true })
  usageLimit?: number;

  @Column({ type: 'int', nullable: true })
  usageLimitPerUser?: number;

  @Column({ type: 'int', default: 0 })
  usedCount: number;
  
  @Column({ type: 'timestamptz' })
  validFrom: Date;

  @Column({ type: 'timestamptz' })
  validUntil: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
