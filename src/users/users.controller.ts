import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { EditUserInfoDto, EditUserPasswordDto } from "./users.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private service: UsersService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@ApiBearerAuth()
	@Get("")
	users() {
		return this.service.getUsers();
	}

	@Get("@me")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	me(@Req() req: Request) {
		return this.service.getOwn(req);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@ApiBearerAuth()
	@Get("/:param")
	user(@Param() params: { param: string }) {
		return this.service.getUser(params.param);
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
