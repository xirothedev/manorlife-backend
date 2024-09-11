import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";
import { IdentifyUserGuard } from "src/app.guard";
import { Request } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("booking")
@Controller("booking")
export class BookingController {
	constructor(private service: BookingService) {}

	@UseGuards(IdentifyUserGuard)
	@Post()
	createBooking(@Body() body: CreateBookingDto, @Req() req: Request) {
		return this.service.createBooking(body, req);
	}
}
