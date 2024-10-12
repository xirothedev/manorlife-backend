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
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { CreateRoomDto, EditRoomDto } from "./room.dto";
import { RoomService } from "./room.service";

@ApiTags("room")
@Controller("room")
export class RoomController {
	constructor(private service: RoomService) {}

	@Get("/:param")
	getRoom(@Param() params: { param: string }) {
		return this.service.getRoom(params.param);
	}

	@Post("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@UseInterceptors(FilesInterceptor("images"))
	createRoom(@Body() body: CreateRoomDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		return this.service.createRoom(body, images);
	}

	@Put("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@UseInterceptors(FilesInterceptor("images"))
	editRoom(@Body() body: EditRoomDto, @UploadedFiles() images: Array<Express.Multer.File>) {
		return this.service.editRoom(body, images);
	}

	@Delete("")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	deleteRoom(@Param() param: string) {
		return this.service.deleteRoom(param);
	}
}
