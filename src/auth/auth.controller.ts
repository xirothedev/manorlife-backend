import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Ip,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GetVerifyDto, LoginDto, PostRecoveryDto, PostVerifyDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/app.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private service: AuthService) {}

	@Post("register")
	register(@Body() body: RegisterDto) {
		return this.service.register(body);
	}

	@HttpCode(HttpStatus.OK)
	@Post("verify/email")
	postVerify(@Body() body: PostVerifyDto) {
		return this.service.postVerifyEmail(body);
	}

	@Get("verify/email")
	getVerify(@Query() query: GetVerifyDto) {
		return this.service.getVerifyEmail(query);
	}

	@HttpCode(HttpStatus.OK)
	@Post("login")
	login(@Body() body: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response, @Ip() ip: string) {
		return this.service.login(body, req, res, ip);
	}

	@HttpCode(HttpStatus.OK)
	@Post("recovery")
	postRecovery(@Body() body: PostRecoveryDto) {
		return this.service.postRecovery(body);
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Delete("/logout")
	logout(@Req() req: Request, @Res() res: Response) {
		return this.service.logout(req, res)
	}
}
