import { ApiProperty } from "@nestjs/swagger";
import { Comport, Province, TradeMark, Ward } from "@prisma/client";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested,
} from "class-validator";

export class GetBranchsDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	province?: Province;

	@ApiProperty()
	@IsOptional()
	@IsString()
	ward?: string;

	@ApiProperty()
	@IsOptional()
	@IsEnum(TradeMark)
	trademark?: TradeMark;

	@ApiProperty()
	@IsOptional()
	@IsNumberString()
	from?: string;

	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	to?: string;

	@ApiProperty()
	@IsOptional()
	@IsNumberString()
	adults?: string;

	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	children?: string;

	@ApiProperty()
	@IsNumberString()
	@IsOptional()
	babies?: string;
}

export class CreateBranchDto {
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
	@IsEnum(TradeMark)
	@IsNotEmpty()
	trademark: TradeMark;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	url: string;

	@ApiProperty()
	@IsEnum(Province)
	@IsNotEmpty()
	province?: Province;

	@ApiProperty()
	@IsEnum(Ward)
	@IsNotEmpty()
	ward?: Ward;

	@ApiProperty()
	@IsArray()
	@IsNotEmpty()
	@IsEnum(Comport, { each: true })
	best_comforts: Comport[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	location: string;

	@ApiProperty()
	@IsDefined()
	@IsNotEmpty()
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
	@IsString()
	@IsNotEmpty()
	@MaxLength(4000)
	description: string;

	@ApiProperty()
	@IsEnum(TradeMark)
	@IsNotEmpty()
	trademark: TradeMark;

	@ApiProperty()
	@IsEnum(Province)
	@IsNotEmpty()
	province?: Province;

	@ApiProperty()
	@IsEnum(Ward)
	@IsNotEmpty()
	ward?: Ward;

	@ApiProperty()
	@IsArray()
	@IsNotEmpty()
	@IsEnum(Comport, { each: true })
	best_comforts: Comport[];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	location: string;

	@ApiProperty()
	@IsDefined()
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SurroundingAreaDto)
	surrounding_area: SurroundingAreaDto[];
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
