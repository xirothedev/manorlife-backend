import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingsDto, CreateBookingDto } from "./booking.dto";
import { AuthGuard, IdentifyUserGuard } from "src/app.guard";
import { Request } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("booking")
@Controller("booking")
export class BookingController {
	constructor(private service: BookingService) {}

	@UseGuards(AuthGuard)
	@Get("")
	bookings(@Query() query: BookingsDto) {
		return this.service.getBookings(query);
	}

	@UseGuards(IdentifyUserGuard)
	@Post()
	createBooking(@Body() body: CreateBookingDto, @Req() req: Request) {
		return this.service.createBooking(body, req);
	}
}
