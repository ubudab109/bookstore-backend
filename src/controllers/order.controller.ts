import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AddOrderDto } from 'src/dto/add_order.dto';
import { PayOrderDto } from 'src/dto/pay_order.dto';
import { Order } from 'src/entities/order.entity';
import { ApiResponse } from 'src/interface/api_response.interface';
import { OrderService } from 'src/services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':customerId/add-to-cart/:bookId')
  async addToCart(
    @Param('customerId') customerId: number,
    @Param('bookId') bookId: number,
    @Body() body: AddOrderDto,
    @Res() res: Response,
  ): Promise<void> {
    let response: ApiResponse<Order | null>;
    try {
      const order = await this.orderService.addToCart(
        customerId,
        bookId,
        body.quantity,
      );
      response = {
        success: true,
        message: 'Order saved successfully',
        data: order,
      };
      res.status(201).json(response);
    } catch (error) {
      response = {
        success: false,
        message: 'Order Failed to save',
        data: null,
      };
      res.status(500).json(response);
    }
  }

  @Put(':orderId/edit')
  async editOrder(
    @Param('orderId') orderId: number,
    @Body() body: AddOrderDto,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.orderService.editOrder(orderId, body.quantity);
    const response: ApiResponse<Order | null> = {
      success: order !== null,
      message:
        order !== null
          ? 'Order updated successfully'
          : 'Failed to update order or data does not exists',
      data: order,
    };
    res.status(order !== null ? 200 : 404).json(response);
  }

  @Delete(':orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: number,
    @Res() res: Response,
  ): Promise<void> {
    await this.orderService.cancelOrder(orderId);
    const response: ApiResponse<null> = {
      success: true,
      message: 'Data deleted successfully',
      data: null,
    };
    res.status(200).json(response);
  }

  @Get('customer/:customerId')
  async getOrdersByCustomer(
    @Param('customerId') customerId: number,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.orderService.getOrdersByCustomer(customerId);
    const response: ApiResponse<Order[]> = {
      success: true,
      message: 'Data fetched successfully',
      data: order,
    };
    res.status(200).json(response);
  }

  @Post('customer/:customerId/pay')
  async payOrders(
    @Param('customerId') customerId: number,
    @Body() orderIds: PayOrderDto,
    @Res() res: Response,
  ): Promise<void> {
    let response: ApiResponse<null>;
    try {
      const order = await this.orderService.payOrders(
        customerId,
        orderIds.orderIds,
      );
      if (order) {
        response = {
          success: true,
          message: 'Order paid successfully',
          data: null,
        };
      } else {
        response = {
          success: false,
          message: 'Your points is less than total',
          data: null,
        };
      }
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      response = {
        success: false,
        message: 'Failed to pay order',
        data: null,
      };
      res.status(500).json(response);
    }
  }
}
