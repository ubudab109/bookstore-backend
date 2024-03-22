import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { LoginRequestI } from 'src/interface/login_request.interface';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async login({ username, password }: LoginRequestI): Promise<Customer | null> {
    if (username && password) {
      const user = await this.customerRepository.findOne({
        where: {
          username: username,
          password: password,
        },
        relations: ['orders'],
      });
      if (user) {
        // Count the number of orders with 'process' status
        const processOrderCount = user.orders.filter(
          (order) => order.status === 'process',
        ).length;
        user.orders = user.orders.filter((order) => order.status === 'process');
        // Add the process order count to the user object
        user.processOrderCount = processOrderCount;
      }
      return user;
    } else {
      return null;
    }
  }
}
