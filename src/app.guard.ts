import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import { Request } from "express";
import { ROLES_KEY } from "./app.decorator";
import { UnauthorizedException } from "./exception";
import { PrismaService } from "./prisma.service";
import { refreshSession } from "./utils/tokenize";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken =
			this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request, "access_token");
		const refreshToken =
			this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request, "refresh_token");

		if (!accessToken) {
			throw new UnauthorizedException({ message: "Invalid token" });
		}

		try {
			const payload = await this.jwt.verifyAsync(accessToken, {
				secret: process.env.ACCESS_TOKEN_SECRET_KEY,
			});

			if (!payload) {
				throw new UnauthorizedException({ message: "Invalid token" });
			} else {
				const session = await this.prisma.session.findUnique({
					where: { session_id: payload.session_id },
					include: { user: { omit: { password: true } } },
				});

				if (!session) {
					throw new UnauthorizedException({ message: "Invalid session" });
				}

				if (new Date(payload.sign_at).getTime() + 60 * 60 * 1000 > Date.now()) {
					request.user = session.user;
					return true;
				}

				if (refreshToken) {
					const refreshPayload = await this.jwt.verifyAsync(refreshToken, {
						secret: process.env.REFRESH_TOKEN_SECRET_KEY,
					});

					if (
						new Date(refreshPayload.sign_at).getTime() + 7 * 24 * 60 * 60 * 1000 > Date.now() &&
						refreshPayload.session_id === session.session_id
					) {
						await refreshSession(session.session_id, request.res, this.jwt, this.prisma);
						request.user = session.user;
						return true;
					}
				}

				throw new UnauthorizedException({ message: "Session expired" });
			}
		} catch (e) {
			console.log(e);
			throw new BadRequestException({ message: "Invalid token" });
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [null, null];
		return type === "Bearer" ? token : undefined;
	}

	private extractTokenFromCookie(request: Request, typeToken: "access_token" | "refresh_token"): string | undefined {
		const token = request.signedCookies[typeToken];
		return token || undefined;
	}
}

@Injectable()
export class IdentifyUserGuard implements CanActivate {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request);

		if (!accessToken) {
			request.user = null;
			return true;
		}

		try {
			const payload = await this.jwt.verifyAsync(accessToken, {
				secret: process.env.ACCESS_TOKEN_SECRET_KEY,
			});

			if (!payload) {
				request.user = null;
				return true;
			} else {
				const session = await this.prisma.session.findUnique({
					where: { session_id: payload.session_id },
					include: { user: { omit: { password: true } } },
				});

				if (!session) {
					request.user = null;
					return true;
				}

				if (new Date(payload.sign_at).getTime() + 60 * 60 * 1000 > Date.now()) {
					request.user = session.user;
					return true;
				}

				request.user = null;
				return true;
			}
		} catch (e) {
			console.log(e);
			request.user = null;
			return true;
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [null, null];
		return type === "Bearer" ? token : undefined;
	}

	private extractTokenFromCookie(request: Request): string | undefined {
		const token = request.signedCookies["access_token"];
		return token || undefined;
	}
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest();
		const isValid = requiredRoles.some((role) => user.roles?.includes(role));
		if (!isValid) {
			throw new UnauthorizedException({ message: "Forbidden resource" });
		} else {
			return true;
		}
	}
}
