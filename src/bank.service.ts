import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as CryptoJS from "crypto-js";
import { InternalServerErrorException } from "./exception";

@Injectable()
export class BankService {
	async create(orderCode: number, amount: number, email: string, phone: string, booking_id: string) {
		try {
			const cancelUrl = `https://manorlife.vn/booking?booking_id=${booking_id}&type=cancel`;
			const returnUrl = `https://manorlife.vn/booking?booking_id=${booking_id}&type=done`;
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
				throw new InternalServerErrorException({ message: "Internal Server Error" });
			}
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Internal Server Error" });
		}
	}

	async cancel() {}

	async finished() {}

	async refund() {}
}
