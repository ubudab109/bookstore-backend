import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  writer: string;

  @Column()
  cover_image: string;

  @Column()
  price: number;

  @Column('simple-array')
  tags: string[];

  @OneToMany(() => Order, (order) => order.book)
  @JoinTable()
  orders: Order[];
}
