import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { BankService } from "src/bank.service";
import { BadRequestException } from "src/exception";
import { PrismaService } from "src/prisma.service";
import { CreateBookingDto, EditBookingDto } from "./booking.dto";

@Injectable()
export class BookingService {
	constructor(
		private prisma: PrismaService,
		private bankService: BankService,
	) {}

	async getBookings() {
		const bookings = await this.prisma.booking.findMany();

		return {
			message: `Lấy thông tin của ${bookings.length} đơn đặt phòng thành công`,
			data: bookings,
		};
	}

	async getBooking(param: string) {
		const booking = await this.prisma.booking.findUnique({ where: { booking_id: param } });

		if (!booking) {
			throw new BadRequestException({ message: "Đặt phòng không tồn tại" });
		}

		return {
			message: "Đã lấy đặt phòng thành công",
			data: booking,
		};
	}

	async createBooking(body: CreateBookingDto, req: Request) {
		const room = await this.prisma.room.findUnique({ where: { room_id: body.room_id } });

		if (!room) {
			throw new BadRequestException({ message: "Đặt phòng tồn tại" });
		}

		if (body.type === "help_set" && (!body.email_customer || !body.phone_customer || !body.fullname_customer)) {
			throw new BadRequestException({
				message: [
					"fullname_customer must be a string",
					"email_customer must be an email",
					"phone_customer must be a valid phone number",
				],
				error: "Bad Request",
				statusCode: 400,
			});
		}

		const fromDate = new Date(body.checkout);
		const toDate = new Date(body.checkin);

		function startOfDay(date) {
			const d = new Date(date);
			d.setHours(0, 0, 0, 0);
			return d;
		}

		const today = startOfDay(new Date());

		if (fromDate.getTime() < today.getTime()) {
			throw new BadRequestException({ message: "Thời gian checkin phải lớn hơn hoặc bằng hôm nay" });
		}

		const nextDay = new Date(fromDate);
		nextDay.setDate(fromDate.getDate() + 1);

		if (toDate.getTime() < nextDay.getTime()) {
			throw new BadRequestException({
				message: "Thời gian checkout phải lớn hơn thời gian checkin ít nhất 1 ngày",
			});
		}

		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return 0;

		const daysDifference = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
		const range = Math.max(daysDifference * (body.range === "months" ? 30 : 1), 1);
		const unit = body.range === "months" ? room.price_per_month : room.price_per_night;
		const cost = unit * Math.round(range);

		const data = await this.prisma.booking.create({
			data: {
				...(req?.user ? { user_id: req.user.user_id } : {}),
				...body,
				amount: cost,
			},
		});

		const bank: PayOSCreatePaymentResponse = await this.bankService.create(
			data.order_code,
			data.amount,
			data.email_order,
			data.phone_order,
			data.booking_id,
		);

		return {
			message: "Tạo đơn đặt phòng thành công",
			data: { ...data, qrUrl: bank.data.checkoutUrl, qrCode: bank.data.qrCode },
		};
	}

	async editBooking(body: EditBookingDto) {
		const booking = await this.prisma.booking.findUnique({ where: { booking_id: body.booking_id } });

		if (!booking) {
			throw new BadRequestException({ message: "Không tìm thấy booking" });
		}

		const data = await this.prisma.booking.update({ where: { booking_id: body.booking_id }, data: body });

		return {
			message: "Chỉnh sửa đặt phòng thành công",
			data,
		};
	}

	async deleteBooking(param: string) {
		const booking = await this.prisma.booking.findUnique({ where: { booking_id: param } });

		if (!booking) {
			throw new BadRequestException({ message: "Không tìm thấy booking" });
		}

		const data = await this.prisma.booking.delete({ where: { booking_id: param } });

		return {
			message: "Xóa đặt phòng thành công",
			data,
		};
	}
}
