import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { sendVerificationEmail } from "src/utils/email";
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from "src/exception";
import { PrismaService } from "src/prisma.service";
import { generateOTP } from "src/utils/helper";
import { signNewSession } from "src/utils/tokenize";
import { GetVerifyDto, LoginDto, PostVerifyDto, RegisterDto } from "./auth.dto";

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
			throw new BadRequestException({ message: "This phone has been used" });
		} else if (user?.email === body.email) {
			throw new BadRequestException({ message: "This email has been used" });
		} else {
			const hashedPassword = await hash(body.password, 10);

			const data = await this.prisma.user.create({
				data: {
					email: body.email,
					phone: body.phone,
					password: hashedPassword,
				},
				omit: { password: true },
			});

			return {
				message: "Created account successfully",
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
			throw new BadRequestException({ message: "User not found" });
		}

		if (user.roles.includes("verified_email")) {
			throw new BadRequestException({ message: "User verified" });
		}

		if (new Date(user.auth[0]?.last_sent_at).getTime() + 60_000 > Date.now()) {
			throw new HttpException({ message: "Too many requests" }, HttpStatus.TOO_MANY_REQUESTS);
		}

		const code = generateOTP();

		const state = await this.jwt.signAsync(code, { secret: process.env.AUTH_TOKEN_SECRET_KEY });

		try {
			await this.prisma.auth.upsert({
				where: { auth_id: user.auth[0].auth_id },
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
				message: "Accept verify request, check your email",
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Internal server error" });
		}
	};

	getVerifyEmail = async (query: GetVerifyDto) => {
		const user = await this.prisma.user.findUnique({
			where: { user_id: query.user_id },
			include: { auth: { where: { auth_type: "email" } } },
			omit: { password: true },
		});
		if (!user) {
			throw new BadRequestException({ message: "User not found" });
		}

		if (user.roles.includes("verified_email")) {
			throw new BadRequestException({ message: "User verified" });
		}

		if (user.auth[0]?.auth_type !== "email") {
			throw new BadRequestException({ message: "Invalid request" });
		}

		if (new Date(user.auth[0]?.last_sent_at).getTime() + 60_000 * 5 <= Date.now()) {
			throw new BadRequestException({ message: "Request expired" });
		}

		if (
			user.auth[0]?.code !== query.identify &&
			this.jwt.verify(query.identify, { secret: process.env.AUTH_TOKEN_SECRET_KEY }) !== user.auth[0]?.code
		) {
			throw new BadRequestException({ message: "Invalid request" });
		}

		try {
			await this.prisma.user.update({
				where: { user_id: query.user_id },
				data: {
					roles: { push: "verified_email" },
					auth: { delete: { auth_id: user.auth[0].auth_id } },
				},
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { auth, ...data } = user;

			return {
				message: "Verified successfully",
				data,
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Internal server error" });
		}
	};

	login = async (body: LoginDto, req: Request, res: Response, ip: string) => {
		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: body.identify }, { phone: body.identify }] },
		});

		if (!user) {
			throw new BadRequestException({ message: "Email or phone not found" });
		}

		const isMatches = await compare(body.password, user.password);

		if (!isMatches) {
			throw new UnauthorizedException({ message: "Password does not matches" });
		}

		if (!user.roles.includes("verified_email")) {
			throw new UnauthorizedException({
				message: "User is not verified",
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
			message: "Logined sucessfully",
			data,
			"@auth": token,
		};
	};
}
