import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { RoomBedType } from "@prisma/client";
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsPositive,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateRoomDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	branch_id: string;

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
	@IsNotEmpty()
	@IsString()
	@MaxLength(4000)
	description: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	acreage: string;

	@ApiProperty()
	@IsEnum(RoomBedType)
	@IsNotEmpty()
	bed_type: RoomBedType;

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	comforts: string[];

	@ApiProperty()
	@IsNotEmpty()
	@IsNumberString()
	stock: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	max_adults: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	max_children: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	max_babies: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	available_from: string;

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	available_to: string;
}

export class EditRoomDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	room_id: string;

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
	@IsString()
	@IsNotEmpty()
	trademark: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MaxLength(4000)
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	best_comforts: string[];

	@ApiProperty()
	@Optional()
	@IsArray()
	@IsString({ each: true })
	existing_urls: string[];

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	stock: number;
}
