import { User } from 'src/app/user/entities/user.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('address')
export class Address extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'text',
  })
  firstName: string;

  @Column({
    type: 'text',
  })
  lastName: string;

  @Column({
    type: 'text',
  })
  addressLine1: string;

  @Column({
    type: 'text',
  })
  addressLine2: string;

  @Column({
    type: 'text',
  })
  countryCode: string;

  @Column({
    type: 'text',
  })
  stateCode: string;

  @Column({
    type: 'text',
  })
  city: string;

  @Column({
    type: 'text',
  })
  postalCode: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDefault: boolean;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
