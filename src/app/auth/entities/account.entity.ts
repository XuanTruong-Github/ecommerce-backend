import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/configs/database/base.entity';
import { User } from 'src/app/user/entities/user.entity';

@Entity('accounts')
@Index(['providerId', 'accountId'], { unique: true })
export class Account extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'text',
  })
  accountId: string;

  @Column({
    type: 'text',
  })
  providerId: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  accessToken?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  refreshToken?: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  accessTokenExpiresAt?: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  refreshTokenExpiresAt?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  scope?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  idToken?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  password?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
