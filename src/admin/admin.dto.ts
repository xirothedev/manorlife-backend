import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import {
	IsArray,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsPhoneNumber,
	IsUUID,
	MaxLength,
	MinLength
} from "class-validator";
import { IsNullable } from "src/app.validator";

export class UsersDto {
	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	count: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	page: string;
}

export class BookingsDto {
	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	count: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	page: string;
}

export class EditUserDto {
	@ApiProperty()
	@IsUUID(7)
	@IsNotEmpty()
	user_id: string;

	@ApiProperty()
	@IsArray()
	@IsEnum(UserRole, { each: true })
	roles: UserRole[];

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string;

	@ApiProperty()
	@MinLength(8)
	@MaxLength(32)
	@IsNullable()
	password: string | null;
}
