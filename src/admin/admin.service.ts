import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { BadRequestException } from "src/exception";
import { PrismaService } from "src/prisma.service";
import { EditUserDto } from "./admin.dto";

@Injectable()
export class AdminService {
	constructor(private prisma: PrismaService) {}

	async editUser(body: EditUserDto) {
		const user = await this.prisma.user.findUnique({ where: { user_id: body.user_id } });

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (body.email !== user.email) {
			const isDuplicateEmail = await this.prisma.user.findUnique({ where: { email: body.email } });

			if (isDuplicateEmail) {
				throw new BadRequestException({ message: "Địa chỉ email đã tồn tại" });
			}
		}

		if (body.phone !== user.phone) {
			const isDuplicatePhone = await this.prisma.user.findUnique({ where: { email: body.phone } });

			if (isDuplicatePhone) {
				throw new BadRequestException({ message: "Số điện thoại đã tồn tại" });
			}
		}

		if (body.password) {
			body.password = await hash(body.password, 10);
		}

		const data = await this.prisma.user.update({
			where: { user_id: body.user_id },
			data: {
				email: body.email,
				phone: body.phone,
				roles: body.roles,
				...(body.password ? { password: body.password } : {}),
			},
			omit: { password: true },
		});

		return {
			message: "Cập nhập người dùng thành công",
			data,
		};
	}

	async banUser(param: string) {
		const user = await this.prisma.user.findUnique({ where: { user_id: param } });

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (user.roles.find((f) => f === "banned")) {
			throw new BadRequestException({ message: "Người dùng đã bị cấm" });
		}

		const data = await this.prisma.user.update({ where: { user_id: param }, data: { roles: { push: "banned" } } });

		return {
			message: "Đã cấm người dùng thành công",
			data,
		};
	}

	async unbanUser(param: string) {
		const user = await this.prisma.user.findUnique({ where: { user_id: param } });

		if (!user) {
			throw new BadRequestException({ message: "Người dùng không tồn tại" });
		}

		if (user.roles.find((f) => f !== "banned")) {
			throw new BadRequestException({ message: "Người dùng không bị cấm" });
		}

		const data = await this.prisma.user.update({
			where: { user_id: param },
			data: { roles: user.roles.filter((f) => f !== "banned") },
		});

		return {
			message: "Đã bỏ cấm người dùng thành công",
			data,
		};
	}
}
