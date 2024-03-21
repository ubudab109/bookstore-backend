import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Order } from './entities/order.entity';
import { Customer } from './entities/customer.entity';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controllers';
import { SeederService } from './services/seed.service';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Book, Customer, Order],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Book, Order, Customer]),
  ],
  controllers: [BookController, LoginController, OrderController],
  providers: [BookService, SeederService, LoginService, OrderService],
})
export class AppModule {}
