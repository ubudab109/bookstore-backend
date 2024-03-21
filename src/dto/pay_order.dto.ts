import { IsNotEmpty, IsArray } from 'class-validator';

export class PayOrderDto {
  @IsArray()
  @IsNotEmpty()
  orderIds: number[];
}
