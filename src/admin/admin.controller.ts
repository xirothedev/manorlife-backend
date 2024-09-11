import { Body, Controller, Get, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/app.decorator";
import { AuthGuard, RolesGuard } from "src/app.guard";
import { BookingsDto, EditUserDto, UsersDto } from "./admin.dto";
import { AdminService } from "./admin.service";

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles("administrator")
@ApiBearerAuth()
@ApiTags("admin")
@Controller("admin")
export class AdminController {
	constructor(private service: AdminService) {}

	@Get("users")
	users(@Query() query: UsersDto) {
		return this.service.getAllUsers(query);
	}

	@Get("bookings")
	bookings(@Query() query: BookingsDto) {
		return this.service.getAllBookings(query);
	}

	@Put("user")
	editUser(@Body() body: EditUserDto) {
		return this.service.editUser(body);
	}
}
