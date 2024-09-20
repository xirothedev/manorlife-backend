import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "./prisma.service";
import path from "path";
import sharp from "sharp";
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

@Injectable()
export class MediaSerivce {
	async transform(image: Express.Multer.File): Promise<string> {
		if (!image) {
			throw new BadRequestException({ message: "Unexpected field" });
		}
		const originalName = path.parse(image.originalname).name;
		const filename = Date.now() + "-" + originalName + ".webp";
		const fullPath = path.join("media", filename);

		try {
			await sharp(image.buffer)
				.resize({ width: 800, height: 450, fit: "cover" })
				.webp({ effort: 3 })
				.toFile(path.join("public", fullPath));

			return fullPath;
		} catch (error) {
			console.error(error);
		}
	}
}
