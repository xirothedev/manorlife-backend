import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { BookingsDto, EditUserDto, UsersDto } from "./admin.dto";
import { BadRequestException } from "src/exception";
import { hash } from "bcrypt";

@Injectable()
export class AdminService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers(query: UsersDto) {
		const users = await this.prisma.user.findMany({
			take: +query.count,
			skip: (+query.page - 1) * +query.count,
			omit: { password: true },
		});

		return {
			message: `Lấy thông tin của ${users.length} người dùng thành công`,
			data: users,
		};
	}

	async getAllBookings(query: BookingsDto) {
		const bookings = await this.prisma.booking.findMany({
			take: +query.count,
			skip: (+query.page - 1) * +query.count,
			include: { user: { omit: { password: true } }, room: true },
		});

		return {
			message: `Lấy thông tin của ${bookings.length} đơn đặt phòng thành công`,
			data: bookings,
		};
	}

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
}
