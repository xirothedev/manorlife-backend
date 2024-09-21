import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminModule } from "./admin/admin.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookingModule } from "./booking/booking.module";
import { BranchModule } from "./branch/branch.module";
import { PaymentModule } from "./payment/payment.module";
import { RoomModule } from "./room/room.module";
import { UsersModule } from "./users/users.module";

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
		BranchModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
