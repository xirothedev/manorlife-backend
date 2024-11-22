import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { CreateBranchDto, EditBranchDto, GetBranchsDto } from "./branch.dto";
import { BranchService } from "./branch.service";

@ApiTags("branch")
@Controller("branch")
export class BranchController {
	constructor(private service: BranchService) {}

	@Post("/search")
	getBranchs(@Body() body: GetBranchsDto) {
		return this.service.getBranchs(body);
	}

	@Get("all")
	getAllBranchs() {
		return this.service.getAllBranchs();
	}

	@Get("/:param")
	getBranch(@Param() params: { param: string }) {
		return this.service.getBranch(params.param);
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
	editBranch(@Body() body: EditBranchDto, @UploadedFiles() images?: Array<Express.Multer.File>) {
		return this.service.editBranch(body, images);
	}

	@Delete("/:param")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	deleteRoom(@Param() params: { param: string }) {
		return this.service.deleteBranch(params.param);
	}
}
