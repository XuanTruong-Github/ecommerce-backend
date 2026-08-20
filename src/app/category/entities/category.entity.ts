import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @Index()
  @Column({
    type: 'int',
    default: 0,
  })
  displayOrder: number;

  @Index()
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Index()
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date | null;

  //   Relations
  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
