import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { BankService } from "src/bank.service";
import { JwtService } from "@nestjs/jwt";

@Module({
	providers: [PrismaService, BookingService, BankService, JwtService],
	controllers: [BookingController]
})
export class BookingModule {}
