import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { CreateBranchDto, EditBranchDto, GetBranchDto } from "./branch.dto";
import { BranchService } from "./branch.service";

@ApiTags("branch")
@Controller("branch")
export class BranchController {
	constructor(private service: BranchService) {}

	@Get("")
	getBranch(@Query() query: GetBranchDto) {
		return this.service.getBranch(query);
	}

	@Post("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@UseInterceptors(FilesInterceptor("images"))
	createBranch(@Body() body: CreateBranchDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		return this.service.createBranch(body, images);
	}

	@Put("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@UseInterceptors(FilesInterceptor("images"))
	editBranch(@Body() body: EditBranchDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		return this.service.editRoom(body, images);
	}

	@Delete("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	deleteRoom(@Param() param: string) {
		return this.service.deleteBranch(param);
	}
}
