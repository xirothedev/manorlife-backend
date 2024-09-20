import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminController } from "./admin/admin.controller";
import { AdminModule } from "./admin/admin.module";
import { AdminService } from "./admin/admin.service";
import { AppController } from "./app.controller";
import { AppService, MediaSerivce } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { BankService } from "./bank.service";
import { BookingController } from "./booking/booking.controller";
import { BookingModule } from "./booking/booking.module";
import { BookingService } from "./booking/booking.service";
import { PaymentController } from "./payment/payment.controller";
import { PaymentModule } from "./payment/payment.module";
import { PrismaService } from "./prisma.service";
import { RoomController } from "./room/room.controller";
import { RoomModule } from "./room/room.module";
import { RoomService } from "./room/room.service";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";

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
		RoomModule,
	],
	controllers: [
		AppController,
		PaymentController,
		AuthController,
		UsersController,
		AdminController,
		BookingController,
		RoomController,
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
		RoomService,
		MediaSerivce
	],
})
export class AppModule {}
