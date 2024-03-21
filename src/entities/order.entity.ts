import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './book.entity';
import { Customer } from './customer.entity';
import { OrderStatus } from 'src/enum/order_status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @ManyToOne(() => Book, (book) => book.orders)
  book: Book;

  @Column()
  ordered_at: Date;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESS,
  })
  status: string;

  @Column({
    default: 0,
  })
  total: number;
}
