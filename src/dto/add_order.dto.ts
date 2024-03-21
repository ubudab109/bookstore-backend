import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddOrderDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
