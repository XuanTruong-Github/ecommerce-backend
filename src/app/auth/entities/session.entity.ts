import { User } from 'src/app/user/entities/user.entity';
import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('sessions')
export class Session extends BaseEntity {
  @Index()
  @Column({
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', unique: true })
  token: string;

  @Index()
  @Column({
    type: 'timestamptz',
  })
  expiresAt: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;
}
