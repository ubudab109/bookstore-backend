import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { OrderStatus } from 'src/enum/order_status.enum';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async addToCart(
    customerId: number,
    bookId: number,
    quantity: number,
  ): Promise<Order> {
    return this.entityManager.transaction(async (entityManager) => {
      const customer = await entityManager.findOneBy(Customer, {
        id: customerId,
      });
      const book = await entityManager.findOneBy(Book, { id: bookId });
      const existingOrder = await entityManager.findOneBy(Order, {
        book: {
          id: bookId,
        },
        customer: {
          id: customerId,
        },
        status: OrderStatus.PROCESS,
      });
      let order: Order;
      if (existingOrder === null) {
        const newOrder = new Order();
        newOrder.customer = customer;
        newOrder.book = book;
        newOrder.quantity = quantity;
        newOrder.ordered_at = new Date();
        newOrder.total = book.price * quantity;
        order = await entityManager.save(Order, newOrder);
      } else {
        existingOrder.quantity += quantity;
        existingOrder.total += book.price * quantity;
        order = await entityManager.save(Order, existingOrder);
      }
      const updatedOrder = await entityManager.find(Order, {
        where: { id: order.id },
        relations: ['customer', 'book'],
      });
      return updatedOrder[0];
    });
  }

  async editOrder(orderId: number, quantity: number): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: ['book'],
    });
    if (order == null) {
      return null;
    } else {
      const book = await this.entityManager.findOne(Book, {
        where: { id: order.book.id },
      });
      if (book) {
        order.quantity = quantity;
        order.total = book.price * quantity;
        return this.orderRepository.save(order);
      } else {
        return null;
      }
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    await this.orderRepository.delete(orderId);
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        customer: {
          id: customerId,
        },
        status: OrderStatus.PROCESS,
      },
      relations: ['book'],
    });
  }

  async payOrders(customerId: number, orderIds: number[]): Promise<boolean> {
    return this.entityManager.transaction(async (entityManager) => {
      let totalPointsToDeduct = 0;

      // Calculate total points to deduct
      for (const orderId of orderIds) {
        const order = await entityManager.findOne(Order, {
          where: {
            id: orderId,
            status: OrderStatus.PROCESS,
            customer: { id: customerId },
          },
        });

        if (order) {
          console.log('order total ' + order.total);
          totalPointsToDeduct += order.total;
        }
      }

      // Fetch customer
      const customer = await entityManager.findOne(Customer, {
        where: { id: customerId },
      });

      if (!customer) {
        return false;
      }

      // Check if customer has enough points
      if (customer.points >= totalPointsToDeduct) {
        // Deduct points and mark orders as paid
        customer.points -= totalPointsToDeduct;
        await entityManager.save(customer);

        for (const orderId of orderIds) {
          const order = await entityManager.findOne(Order, {
            where: { id: orderId },
          });

          if (order) {
            order.status = OrderStatus.PAID;
            await entityManager.save(order);
          }
        }
        return true;
      } else {
        return false;
      }
    });
  }
}
