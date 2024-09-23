import { Injectable } from "@nestjs/common";
import { BankService } from "src/bank.service";
import { BadRequestException } from "src/exception";
import { ConfirmPaymentDto } from "./payment.dto";

@Injectable()
export class PaymentService {
	constructor(
		private bank: BankService,
	) {}

	async confirm(body: ConfirmPaymentDto) {
		const orderCode = Number(body.order_code);
		if (isNaN(orderCode)) {
			throw new BadRequestException({ message: "Order code không hợp lệ" });
		}

		return this.bank.confirm(orderCode);
	}

	async cancel(body: ConfirmPaymentDto) {
		const orderCode = Number(body.order_code);
		if (isNaN(orderCode)) {
			throw new BadRequestException({ message: "Order code không hợp lệ" });
		}

		return this.bank.cancel(orderCode);
	}
}
