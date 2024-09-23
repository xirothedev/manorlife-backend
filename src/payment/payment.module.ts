import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PrismaService } from "src/prisma.service";
import { BankService } from "src/bank.service";

@Module({
	providers: [PaymentService, PrismaService, BankService],
	controllers: [PaymentController],
})
export class PaymentModule {}
