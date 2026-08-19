import { BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v7 as uuidV7 } from 'uuid';
export abstract class BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidV7();
    }
  }

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
