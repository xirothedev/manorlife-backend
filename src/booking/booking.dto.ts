import { ApiProperty } from "@nestjs/swagger";
import { BookingRange, BookingType } from "@prisma/client";
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";
import { IsNullable } from "src/app.validator";

export class BookingsDto {
	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	count?: string;

	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	page?: string;
}

export class CreateBookingDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(3)
	adults: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(3)
	children: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(3)
	babies: number;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	checkin: string | Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	checkout: string | Date;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname_order: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email_order: string;

	@ApiProperty()
	@IsPhoneNumber()
	@IsNotEmpty()
	phone_order: string;

	@ApiProperty()
	@IsString()
	@IsNullable()
	fullname_customer: string;

	@ApiProperty()
	@IsEmail()
	@IsNullable()
	email_customer: string;

	@ApiProperty()
	@IsPhoneNumber()
	@IsNullable()
	phone_customer: string;

	@ApiProperty()
	@IsEnum(BookingType)
	@IsNotEmpty()
	type: BookingType;

	@ApiProperty()
	@IsEnum(BookingRange)
	@IsNotEmpty()
	range: BookingRange;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	room_id: string;

	@ApiProperty()
	@IsString()
	@IsNullable()
	@MaxLength(4000)
	note: string;
}
