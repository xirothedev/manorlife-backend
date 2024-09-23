import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  order_code: string
}

export class CancelPaymentDto {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  order_code: string
}