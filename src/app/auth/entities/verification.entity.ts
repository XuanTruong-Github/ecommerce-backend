import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('verifications')
export class Verification extends BaseEntity {
  @Column({ type: 'text' })
  identifier: string;

  @Column({
    type: 'text',
  })
  value: string;

  @Column({
    type: 'timestamptz',
  })
  expiresAt: Date;
}
