import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { sendPasswordEmail, sendRecoveryEmail, sendVerificationEmail } from "src/utils/email";
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from "src/exception";
import { PrismaService } from "src/prisma.service";
import { createString, generateOTP } from "src/utils/helper";
import { revokeSession, signNewSession } from "src/utils/tokenize";
import { GetVerifyDto, LoginDto, PostRecoveryDto, PostVerifyDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	register = async (body: RegisterDto) => {
		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: body.email }, { phone: body.phone }] },
		});

		if (user?.phone === body.phone) {
			throw new BadRequestException({ message: "Số điện thoại này đã được sử dụng" });
		} else if (user?.email === body.email) {
			throw new BadRequestException({ message: "Địa chỉ email này đã được sử dụng" });
		} else {
			const hashedPassword = await hash(body.password, 10);

			const data = await this.prisma.user.create({
				data: {
					fullname: body.fullname,
					email: body.email,
					phone: body.phone,
					password: hashedPassword,
					roles: ["bronze"],
				},
				omit: { password: true },
			});

			return {
				message: "Tạo tài khoản thành công",
				data,
			};
		}
	};

	postVerifyEmail = async (body: PostVerifyDto) => {
		const user = await this.prisma.user.findUnique({
			where: { user_id: body.user_id },
			include: { auth: { where: { auth_type: "email" } } },
		});
		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (user.roles.includes("verified_email")) {
			throw new BadRequestException({ message: "Người dùng đã xác minh rồi" });
		}

		if (new Date(user.auth?.last_sent_at).getTime() + 60_000 > Date.now()) {
			throw new HttpException({ message: "Gửi quá nhiều lần" }, HttpStatus.TOO_MANY_REQUESTS);
		}

		const code = generateOTP();

		const state = await this.jwt.signAsync(code, { secret: process.env.AUTH_TOKEN_SECRET_KEY });

		try {
			await this.prisma.auth.upsert({
				where: { auth_id: user?.auth?.auth_id || "" },
				update: {
					auth_type: "email",
					last_sent_at: new Date(),
					code,
				},
				create: {
					auth_type: "email",
					last_sent_at: new Date(),
					code,
					user: { connect: { user_id: body.user_id } },
				},
			});

			await sendVerificationEmail(user.email, {
				code,
				oauth: `${process.env.APPLICATION_BASE_URL}/auth/verify/email?user_id=${body.user_id}&identify=${state}`,
			});

			return {
				message: "Chấp nhận yêu cầu, kiểm tra hòm thư của bạn",
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	};

	getVerifyEmail = async (query: GetVerifyDto) => {
		const user = await this.prisma.user.findUnique({
			where: { user_id: query.user_id },
			include: { auth: { where: { auth_type: "email" } } },
			omit: { password: true },
		});

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (user.roles.includes("verified_email")) {
			throw new BadRequestException({ message: "Người dùng đã xác minh rồi" });
		}

		if (user.auth?.auth_type !== "email") {
			throw new BadRequestException({ message: "Yêu cầu không hợp lệ" });
		}

		if (new Date(user.auth?.last_sent_at).getTime() + 60_000 * 5 <= Date.now()) {
			throw new BadRequestException({ message: "Yêu cầu hết hạn" });
		}

		if (
			user.auth?.code !== query.identify &&
			this.jwt.verify(query.identify, { secret: process.env.AUTH_TOKEN_SECRET_KEY }) !== user.auth?.code
		) {
			throw new BadRequestException({ message: "Yêu cầu không hợp lệ" });
		}

		try {
			await this.prisma.user.update({
				where: { user_id: query.user_id },
				data: {
					roles: { push: "verified_email" },
					auth: { delete: { auth_id: user.auth.auth_id } },
				},
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { auth, ...data } = user;

			return {
				message: "Xác minh thành công",
				data,
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	};

	login = async (body: LoginDto, req: Request, res: Response, ip: string) => {
		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: body.identify }, { phone: body.identify }] },
		});

		if (!user) {
			throw new BadRequestException({ message: "Địa chỉ email hoặc số điện thoại không tồn tại" });
		}

		const isMatches = await compare(body.password, user.password);

		if (!isMatches) {
			throw new UnauthorizedException({ message: "Mật khẩu không khớp" });
		}

		if (!user.roles.includes("verified_email")) {
			throw new UnauthorizedException({
				message: "Người dùng chưa xác thực",
				data: { user_id: user.user_id },
			});
		}

		const token = await signNewSession(user.user_id, res, this.jwt, this.prisma, {
			agent: req.headers["user-agent"],
			ip,
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...data } = user;

		return {
			message: "Đăng nhập thành công",
			data,
			"@auth": token,
		};
	};

	async postRecovery(body: PostRecoveryDto) {
		const user = await this.prisma.user.findUnique({ where: { email: body.email }, include: { auth: true } });

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (new Date(user.auth?.last_sent_at).getTime() + 60_000 > Date.now()) {
			throw new HttpException({ message: "Gửi quá nhiều lần" }, HttpStatus.TOO_MANY_REQUESTS);
		}

		const code = generateOTP();

		const state = await this.jwt.signAsync(code, { secret: process.env.AUTH_TOKEN_SECRET_KEY });

		try {
			await this.prisma.auth.upsert({
				where: { auth_id: user?.auth?.auth_id || "" },
				update: {
					auth_type: "recovery",
					last_sent_at: new Date(),
					code,
				},
				create: {
					auth_type: "recovery",
					last_sent_at: new Date(),
					code,
					user: { connect: { user_id: user.user_id } },
				},
			});

			await sendRecoveryEmail(user.email, {
				code,
				oauth: `${process.env.APPLICATION_BASE_URL}/auth/verify/email?user_id=${user.user_id}&identify=${state}`,
			});

			return {
				message: "Chấp nhận yêu cầu, kiểm tra hòm thư của bạn",
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	}

	getRecovery = async (query: GetVerifyDto) => {
		const user = await this.prisma.user.findUnique({
			where: { user_id: query.user_id },
			include: { auth: { where: { auth_type: "recovery" } } },
			omit: { password: true },
		});

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (user.auth?.auth_type !== "recovery") {
			throw new BadRequestException({ message: "Yêu cầu không hợp lệ" });
		}

		if (new Date(user.auth?.last_sent_at).getTime() + 60_000 * 5 <= Date.now()) {
			throw new BadRequestException({ message: "Yêu cầu hết hạn" });
		}

		if (
			user.auth?.code !== query.identify &&
			this.jwt.verify(query.identify, { secret: process.env.AUTH_TOKEN_SECRET_KEY }) !== user.auth?.code
		) {
			throw new BadRequestException({ message: "Yêu cầu không hợp lệ" });
		}

		try {
			const newPassword = createString();
			const hashedPassword = await hash(newPassword, 10);
			await this.prisma.user.update({ where: { user_id: user.user_id }, data: { password: hashedPassword } });

			await sendPasswordEmail(user.email, { password: newPassword });

			return {
				message: "Đã gửi mật khẩu mới, kiểm tra hòm thư!",
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	};

	async logout(req: Request, res: Response) {
		const accessToken = req.signedCookies["access_token"];
		if (!accessToken) {
			throw new UnauthorizedException({ message: "Token không hợp lệ" });
		}

		try {
			const payload = await this.jwt.verifyAsync(accessToken, {
				secret: process.env.ACCESS_TOKEN_SECRET_KEY,
			});

			if (!payload) {
				throw new UnauthorizedException({ message: "Token không hợp lệ" });
			} else {
				const session = await this.prisma.session.findUnique({
					where: { session_id: payload.session_id },
					include: { user: { omit: { password: true } } },
				});

				if (!session) {
					throw new UnauthorizedException({ message: "Session không hợp lệ" });
				}

				if (new Date(payload.sign_at).getTime() + 60 * 60 * 1000 > Date.now()) {
					if (session.user.roles.find((f) => f === "banned")) {
						throw new UnauthorizedException({ message: "Người dùng đã bị cấm" });
					}

					await revokeSession(session.session_id, res, this.prisma);
					return {
						message: "Đăng xuất thành công",
					};
				}

				throw new UnauthorizedException({ message: "Session hết hạn" });
			}
		} catch (e) {
			console.log(e);
			throw new BadRequestException({ message: "Token không hợp lệ" });
		}
	}
}
