import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentController } from "./payment/payment.controller";
import { PaymentModule } from "./payment/payment.module";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { AdminController } from "./admin/admin.controller";
import { AdminModule } from "./admin/admin.module";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "./prisma.service";
import { UsersService } from "./users/users.service";
import { AdminService } from "./admin/admin.service";
import { BookingController } from "./booking/booking.controller";
import { BookingModule } from "./booking/booking.module";
import { BookingService } from "./booking/booking.service";
import { BankService } from "./bank.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [
		PaymentModule,
		ConfigModule.forRoot({
			envFilePath: [".env"],
			isGlobal: true,
			cache: true,
		}),
		AuthModule,
		UsersModule,
		AdminModule,
		BookingModule,
		ScheduleModule.forRoot(),
	],
	controllers: [
		AppController,
		PaymentController,
		AuthController,
		UsersController,
		AdminController,
		BookingController,
	],
	providers: [
		AppService,
		AuthService,
		UsersService,
		AdminService,
		BookingService,
		JwtService,
		PrismaService,
		BankService,
	],
})
export class AppModule {}
