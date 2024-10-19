import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/app.decorator";
import { AuthGuard, IdentifyUserGuard, RolesGuard } from "src/app.guard";
import { CreateBookingDto, EditBookingDto } from "./booking.dto";
import { BookingService } from "./booking.service";

@ApiTags("booking")
@Controller("booking")
export class BookingController {
	constructor(private service: BookingService) {}

	@UseGuards(AuthGuard)
	@Get("")
	bookings() {
		return this.service.getBookings();
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@Get("")
	booking(@Param() params: { param: string }) {
		return this.service.getBooking(params.param);
	}

	@UseGuards(IdentifyUserGuard)
	@Post()
	createBooking(@Body() body: CreateBookingDto, @Req() req: Request) {
		return this.service.createBooking(body, req);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@Put()
	editBooking(@Body() body: EditBookingDto) {
		return this.service.editBooking(body);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles("administrator")
	@Delete()
	deleteBooking(@Param() params: { booking }) {
		return this.service.deleteBooking(params.booking);
	}
}
