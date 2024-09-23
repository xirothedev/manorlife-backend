import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { EditUserInfoDto, EditUserPasswordDto, UsersDto } from "./users.dto";
import { BadRequestException, UnauthorizedException } from "src/exception";
import { Request } from "express";
import { compare, hash } from "bcrypt";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async getOwn(req: Request) {
		const user = await this.prisma.user.findUnique({
			where: { user_id: req.user.user_id },
			omit: { password: true },
			include: {
				booking: { select: { booking_id: true, order_code: true, type: true, status: true, create_at: true } },
			},
		});

		return {
			message: "Lấy thông tin bản thân thành công",
			data: user,
		};
	}

	async getUsers(query: UsersDto) {
		if (query?.count || query?.page) {
			const users = await this.prisma.user.findMany({
				take: +query.count || 10,
				skip: ((+query.page || 1) - 1) * (+query.count || 10),
				omit: { password: true },
			});

			return {
				message: `Lấy thông tin của ${users.length} người dùng thành công`,
				data: users,
			};
		} else {
			const users = await this.prisma.user.findMany();

			return {
				message: `Lấy thông tin của ${users.length} người dùng thành công`,
				data: users,
			};
		}
	}

	async editUserInfo(body: EditUserInfoDto, req: Request) {
		if (req.user.phone !== body.phone) {
			const user = await this.prisma.user.findUnique({ where: { phone: body.phone } });

			if (user) {
				throw new BadRequestException({ message: "Số điện thoại đã tồn tại" });
			}
		}

		const data = await this.prisma.user.update({
			where: { user_id: req.user.user_id },
			data: { fullname: body.fullname, phone: body.phone, nationality: body.nationality },
			omit: { password: true },
		});

		return {
			message: "Cập nhập thông tin người dùng thành công",
			data,
		};
	}

	async editUserPassword(body: EditUserPasswordDto, req: Request) {
		if (body.new_password !== body.repeat_password) {
			throw new BadRequestException({ message: "Mật khẩu mới không khớp" });
		}

		const user = await this.prisma.user.findUnique({ where: { user_id: req.user.user_id } });

		const verify = await compare(body.old_password, user.password);

		if (!verify) {
			throw new UnauthorizedException({ message: "Mật khẩu cũ không đúng" });
		}

		const hashedPassword = await hash(body.new_password, 10);

		const data = await this.prisma.user.update({
			where: { user_id: user.user_id },
			data: { password: hashedPassword },
			omit: { password: true },
		});

		return {
			message: "Cập nhập mật khẩu thành công",
			data,
		};
	}
}
