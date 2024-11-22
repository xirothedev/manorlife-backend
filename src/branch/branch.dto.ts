import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested,
} from "class-validator";

export class GetBranchsDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	province?: string;

	@ApiProperty()
	@IsOptional()
	@IsString({ each: true })
	wards?: string[];

	@ApiProperty()
	@IsOptional()
	@IsString()
	trademark?: string;

	@ApiProperty()
	@IsOptional()
	@IsDateString()
	from?: Date;

	@ApiProperty()
	@IsOptional()
	@IsDateString()
	to?: Date;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	adults?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	children?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	babies?: number;

	@ApiProperty()
	@IsEnum({ desc: "desc", asc: "asc", popular: "popular" })
	@IsOptional()
	sort?: "desc" | "asc" | "popular";
}

export class CreateBranchDto {
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
	@IsString()
	@IsNotEmpty()
	trademark: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	url: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	province: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	ward: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	best_comforts: string[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	location: string;

	@ApiProperty()
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SurroundingAreaDto)
	surrounding_area: SurroundingAreaDto[];
}

export class EditBranchDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	branch_id: string;

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
	@IsString()
	@IsNotEmpty()
	trademark: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	province: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	ward: string;

	@ApiProperty()
	@IsArray()
	@IsNotEmpty()
	@IsString({ each: true })
	best_comforts: string[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	location: string;

	@ApiProperty()
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SurroundingAreaDto)
	surrounding_area: SurroundingAreaDto[];

	@ApiProperty()
	@Optional()
	@IsArray()
	@IsString({ each: true })
	existing_urls: string[];
}

export class SurroundingAreaDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	distance: string;
}
