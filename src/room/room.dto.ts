import { ApiProperty } from "@nestjs/swagger";
import { RoomStatus, Comport, TradeMark } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	branch: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	price_per_night: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	price_per_month: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(4000)
	description: string;

	@ApiProperty()
	@IsEnum(Comport, { each: true })
  @IsNotEmpty()
	comforts: Comport;

	@ApiProperty()
  @IsEnum(RoomStatus)
  @IsNotEmpty()
	status: RoomStatus;

	@ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
	stock: string;
}

export class EditRoomDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	room_id: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	branch: string;

	@ApiProperty()
	@IsPositive()
	@IsNotEmpty()
	price_per_night: number;

	@ApiProperty()
	@IsPositive()
	@IsNotEmpty()
	price_per_month: number;

	@ApiProperty()
	@IsEnum(TradeMark)
	@IsNotEmpty()
	trademark: TradeMark;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(4000)
	description: string;

	@ApiProperty()
	@IsEnum(Comport, { each: true })
  @IsNotEmpty()
	comforts: Comport;

	@ApiProperty()
  @IsEnum(RoomStatus)
  @IsNotEmpty()
	status: RoomStatus;

	@ApiProperty()
  @IsNotEmpty()
  @IsNumber()
	stock: number;
}
