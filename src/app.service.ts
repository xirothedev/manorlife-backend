import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "./prisma.service";
@Injectable()
export class AppService {
	getHello(): string {
		return "Hello World!";
	}
}
@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);
	constructor(private prisma: PrismaService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: "Delete account not verify",
	})
	async deleteAccount() {
		this.prisma.user.deleteMany({
			where: {
				roles: { isEmpty: true },
				create_at: { lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
			},
		});
	}
}
