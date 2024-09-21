import { ApiProperty } from "@nestjs/swagger";
import { Comport, Province, TradeMark, Ward } from "@prisma/client";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested,
} from "class-validator";

export class GetBranchDto {
	@ApiProperty()
	@IsOptional()
	@IsEnum(Province)
	province?: Province;

	@ApiProperty()
	@IsOptional()
	@IsEnum(Ward)
	ward?: Ward;

	@ApiProperty()
	@IsOptional()
	@IsEnum(TradeMark)
	trademark?: TradeMark;
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
