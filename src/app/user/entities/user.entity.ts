import { BaseEntity } from 'src/configs/database/base.entity';
import { UserRole } from 'src/shared/types/user-role.enum';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'text',
  })
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  email_verified: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  image: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  date_of_birth: Date | null;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;
}
