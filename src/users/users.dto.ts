import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";
import {
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

export class UsersDto {
	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	count?: string;

	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	page?: string;
}

export class EditUserInfoDto {
	@ApiProperty()
	@IsPhoneNumber()
	@IsNotEmpty()
	phone: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname: string;

	@ApiProperty()
	@IsEnum(Country)
	@Optional()
	nationality?: Country;
}

export class EditUserPasswordDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	old_password: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	new_password: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	repeat_password: string;
}
