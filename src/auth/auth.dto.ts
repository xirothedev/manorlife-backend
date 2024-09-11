import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	password: string;
}

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	identify: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	password: string;
}

export class PostVerifyDto {
	@ApiProperty()
	@IsUUID(7)
	user_id: string;
}

export class GetVerifyDto {
	@ApiProperty()
	@IsUUID(7)
	user_id: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	identify: string;
}
