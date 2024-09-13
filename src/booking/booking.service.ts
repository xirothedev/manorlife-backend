import { Injectable } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Request } from "express";
import { BankService } from "src/bank.service";
import { BadRequestException } from "src/exception";
import { PrismaService } from "src/prisma.service";
import { CreateBookingDto } from "./booking.dto";

@Injectable()
export class BookingService {
	constructor(
		private prisma: PrismaService,
		private bankService: BankService,
	) {}

	async createBooking(body: CreateBookingDto, req: Request) {
		const room = await this.prisma.room.findUnique({ where: { room_id: body.room_id } });

		body.checkin = new Date(body.checkin);
		body.checkout = new Date(body.checkout);

		if (!room) {
			throw new BadRequestException({ message: "Phòng không tồn tại" });
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

		if (body.checkin.getTime() <= Date.now()) {
			throw new BadRequestException({ message: "Thời gian checkin không hợp lệ" });
		}

		if (body.checkout.getTime() <= Date.now() || body.checkout.getTime() <= body.checkin.getTime()) {
			throw new BadRequestException({ message: "Thời gian checkout không hợp lệ" });
		}

		const unit = body.range === "months" ? room.price_per_month : room.price_per_night;
		const range = Math.ceil(
			dayjs(body.checkout).diff(dayjs(body.checkin), body.range === "months" ? "month" : "day"),
		);

		const cost = unit * range;

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
}
