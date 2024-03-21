import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({
    nullable: true,
    select: false,
  })
  password: string;

  @Column({ default: 100 })
  points: number;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  processOrderCount: number;
}
