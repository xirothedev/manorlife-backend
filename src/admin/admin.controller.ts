import { Body, Controller, Delete, Param, Patch, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { EditUserDto } from "./admin.dto";
import { AdminService } from "./admin.service";

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles("administrator")
@ApiTags("admin")
@Controller("admin")
export class AdminController {
	constructor(private service: AdminService) {}

	@Put("user")
	editUser(@Body() body: EditUserDto) {
		return this.service.editUser(body);
	}

	@Delete("user")
	deleteUser(@Param() params: {user}) {
		return this.service.deleteUser(params.user)
	}

	@Patch("ban")
	banUser(@Param() params: {user}) {
		return this.service.banUser(params.user);
	}

	@Patch("unban")
	unbanUser(@Param() param: string) {
		return this.service.unbanUser(param);
	}
}
