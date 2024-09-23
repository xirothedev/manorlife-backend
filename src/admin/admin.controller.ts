import { Body, Controller, Param, Patch, Put, UseGuards } from "@nestjs/common";
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

	@Patch("ban")
	banUser(@Param() param: string) {
		return this.service.banUser(param);
	}

	@Patch("unban")
	unbanUser(@Param() param: string) {
		return this.service.unbanUser(param);
	}
}
