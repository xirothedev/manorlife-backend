import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { EditUserInfoDto, EditUserPasswordDto, UsersDto } from "./users.dto";
import { Request } from "express";
import { Roles } from "src/app.decorator";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private service: UsersService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@ApiBearerAuth()
	@Get("")
	users(@Query() query: UsersDto) {
		return this.service.getUsers(query);
	}

	@Get("@me")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	me(@Req() req: Request) {
		return this.service.getOwn(req)
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
	editUserPassword(@Body() body: EditUserPasswordDto, @Req() req: Request) {
		return this.service.editUserPassword(body, req);
	}
}
