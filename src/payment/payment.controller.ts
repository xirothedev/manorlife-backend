import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CancelPaymentDto, ConfirmPaymentDto } from "./payment.dto";
import { PaymentService } from "./payment.service";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
	constructor(private service: PaymentService) {}

	@Post("response")
	response(@Body() body: any) {
		console.log(body);
	}

	@Post("confirm")
	comfirm(@Body() body: ConfirmPaymentDto) {
		return this.service.confirm(body);
	}

	@Post("cancel")
	cancel(@Body() body: CancelPaymentDto) {
		return this.service.cancel(body);
	}
}
// success
// {
//   code: '00',
//   desc: 'success',
//   success: true,
//   data: {
//     accountNumber: '0359186887',
//     amount: 5000,
//     description: 'cm1bldqpy0001ptkvdcmetujs',
//     reference: 'FT24265396205257',
//     transactionDateTime: '2024-09-21 10:31:05',
//     virtualAccountNumber: '',
//     counterAccountBankId: '970422',
//     counterAccountBankName: '',
//     counterAccountName: 'LE THANH TRUNG',
//     counterAccountNumber: '0359186887',
//     virtualAccountName: '',
//     currency: 'VND',
//     orderCode: 10000,
//     paymentLinkId: '0caf5f96f9ac4e25b70b2afa14c65053',
//     code: '00',
//     desc: 'success'
//   },
//   signature: 'dd9aac8cbf4979c97f79cd6b52afcf3d517f06e1fb0c2d7fc1e4a9e0acc3bd43'
// }
