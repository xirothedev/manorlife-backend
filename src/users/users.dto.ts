import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

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
	old_password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
	new_password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
	repeat_password: string;
}