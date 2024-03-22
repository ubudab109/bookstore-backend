import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from 'src/dto/login.dto';
import { Customer } from 'src/entities/customer.entity';
import { ApiResponse } from 'src/interface/api_response.interface';
import { LoginService } from 'src/services/login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const customer = await this.loginService.login({
      username: loginDto.username,
      password: loginDto.password,
    });
    const response: ApiResponse<Customer | null> = {
      success: customer !== null,
      message:
        customer !== null
          ? 'Login Successfully'
          : ['Unauthorized. Username or password wrong'],
      data: customer,
    };
    res.status(customer !== null ? 201 : 401).json(response);
  }
}
