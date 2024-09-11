import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Query, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GetVerifyDto, LoginDto, PostVerifyDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

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
}
