import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
	@Post("response")
	response(@Body() body: any) {
		console.log(body);
	}
}
