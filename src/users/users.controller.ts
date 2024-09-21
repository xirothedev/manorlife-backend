import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/app.guard";
import { EditUserInfoDto, EditUserPasswordDto } from "./users.dto";
import { Request } from "express";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private service: UsersService) {}

	@Get("@me")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	me(@Req() req: Request) {
		return {
			message: "Lấy thông tin bản thân thành công",
			data: req.user,
		};
	}

	@Put("info")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	editUserInfo(@Body() body: EditUserInfoDto, @Req() req: Request) {
		return this.service.editUserInfo(body, req);
	}

	@Put("password")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	editUserPassword(@Body() body: EditUserPasswordDto,  @Req() req: Request) {
		return this.service.editUserPassword(body, req)
	}
}
