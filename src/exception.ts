import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
	constructor(response: any) {
		super(response, HttpStatus.FORBIDDEN);
	}
}

export class UnauthorizedException extends HttpException {
	constructor(response: any) {
		super(response, HttpStatus.UNAUTHORIZED);
	}
}

export class InternalServerErrorException extends HttpException {
	constructor(response: any) {
		super(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

export class BadRequestException extends HttpException {
	constructor(response: any) {
		super(response, HttpStatus.BAD_REQUEST);
	}
}
