import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as CryptoJS from "crypto-js";
import { BadRequestException, InternalServerErrorException } from "./exception";
import { PrismaService } from "./prisma.service";

@Injectable()
export class BankService {
	constructor(private prisma: PrismaService) {}

	async create(orderCode: number, amount: number, email: string, phone: string, booking_id: string) {
		try {
			const cancelUrl = `https://manorlife.vn/booking`;
			const returnUrl = `https://manorlife.vn/booking`;
			const signature = CryptoJS.HmacSHA256(
				`amount=${amount}&cancelUrl=${cancelUrl}&description=${booking_id}&orderCode=${orderCode}&returnUrl=${returnUrl}`,
				process.env.PAYMENT_CHECKSUM_KEY,
			);

			const res = await axios.post(
				"https://api-merchant.payos.vn/v2/payment-requests",
				{
					orderCode,
					amount,
					description: booking_id,
					buyerName: "",
					buyerEmail: email,
					buyerPhone: phone,
					buyerAddress: "",
					items: [],
					cancelUrl,
					returnUrl,
					expiredAt: Math.round(Date.now() / 1000) + 15 * 60_000,
					signature: signature.toString(CryptoJS.enc.Hex),
				},
				{
					headers: {
						"x-client-id": process.env.PAYMENT_CLIENT_ID,
						"x-api-key": process.env.PAYMENT_API_KEY,
					},
				},
			);

			if (res.data.code === "00") {
				return res.data;
			} else {
				console.log(res.data);
				throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
			}
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	}

	async confirm(orderCode: number) {
		const booking = await this.prisma.booking.findUnique({ where: { order_code: orderCode } });

		if (!booking) {
			throw new BadRequestException({ message: "Booking không tồn tại" });
		}

		try {
			const res = await axios.get<PayOSGetPaymentData>(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, {
				headers: {
					"x-client-id": process.env.PAYMENT_CLIENT_ID,
					"x-api-key": process.env.PAYMENT_API_KEY,
				},
			});

			if (res.data.code === "00" && res.data.data.status === "PAID") {
				if (res.data.data.amountPaid >= res.data.data.amount && res.data.data.amount === booking.amount) {
					await this.prisma.booking.update({
						where: { order_code: orderCode },
						data: { status: "paid" },
					});

					if (res.data.data.amountPaid > res.data.data.amount) {
						throw new BadRequestException({ message: "Quý khách thanh toán quá số tiền cần thiết" });
					}

					return;
				} else if (res.data.data.amountRemaining > 0) {
					throw new BadRequestException({ message: "Quý khách chưa thanh toán đủ tiền" });
				}
			} else {
				console.log(res.data);
				throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
			}
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	}

	async cancel(orderCode: number) {
		const booking = await this.prisma.booking.findUnique({ where: { order_code: orderCode } });

		if (!booking) {
			throw new BadRequestException({ message: "Booking không tồn tại" });
		}

		try {
			const res = await axios.get<PayOSGetPaymentData>(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, {
				headers: {
					"x-client-id": process.env.PAYMENT_CLIENT_ID,
					"x-api-key": process.env.PAYMENT_API_KEY,
				},
			});

			if (res.data.code === "00" && res.data.data.status === "CANCELLED") {
				await this.prisma.booking.update({
					where: { order_code: orderCode },
					data: { status: "cancelled" },
				});

				return;
			} else {
				console.log(res.data);
				throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
			}
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp trục trặc, thử lại sau" });
		}
	}
}
