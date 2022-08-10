import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude()
  @Column()
  password: string;

  // cannot use hooks if we insert directly to database using save
  @AfterInsert()
  logInsert() {
    console.log('user inserted with email ' + this.email);
  }

  @AfterRemove()
  logRemove() {
    console.log('user removed with email ' + this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user updated with email ' + this.email);
  }
}
