import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	fullname: string;

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
	@IsString()
	user_id: string;
}

export class GetVerifyDto {
	@ApiProperty()
	@IsString()
	user_id: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	identify: string;
}

export class PostRecoveryDto {
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
