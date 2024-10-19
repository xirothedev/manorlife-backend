import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDefined,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested
} from "class-validator";

export class GetBranchsDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	province?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	ward?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	trademark?: string;

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
	@IsArray()
	@IsNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@MaxLength(4000, { each: true })
	description: string[];

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
	@IsArray()
	@IsNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@MaxLength(4000, { each: true })
	description: string[];

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
