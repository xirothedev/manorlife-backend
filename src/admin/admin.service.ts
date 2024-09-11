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
			message: `Get ${users.length} user(s) data successfully`,
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
			message: `Get ${bookings.length} booking(s) data successfully`,
			data: bookings,
		};
	}

	async editUser(body: EditUserDto) {
		const user = await this.prisma.user.findUnique({ where: { user_id: body.user_id } });

		if (!user) {
			throw new BadRequestException({ message: "User not found" });
		}

		if (body.email !== user.email) {
			const isDuplicateEmail = await this.prisma.user.findUnique({ where: { email: body.email } });

			if (isDuplicateEmail) {
				throw new BadRequestException({ message: "Email duplicate" });
			}
		}

		if (body.phone !== user.phone) {
			const isDuplicatePhone = await this.prisma.user.findUnique({ where: { email: body.phone } });

			if (isDuplicatePhone) {
				throw new BadRequestException({ message: "Phone duplicate" });
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
			message: "Updated user successfully",
			data,
		};
	}
}
