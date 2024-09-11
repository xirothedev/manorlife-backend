import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/app.guard";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private service: UsersService) {}

	@Get("@me")
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	me(@Req() req) {
		return {
			message: "Get own data successfully",
			data: req.user,
		};
	}
}
