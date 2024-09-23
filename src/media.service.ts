import { Injectable } from "@nestjs/common";
import { BadRequestException } from "./exception";
import * as path from "path";
import * as sharp from "sharp";

@Injectable()
export class MediaSerivce {
	async transform(image: Express.Multer.File): Promise<string> {
		if (!image) {
			throw new BadRequestException({ message: "Thiếu trường hình ảnh" });
		}
		const originalName = image.originalname;
		const filename = Date.now() + "-" + originalName + ".webp";
		const fullPath = path.join("media", filename);

		try {
			await sharp(image.buffer)
				.resize({ width: 800, height: 500, fit: "cover" })
				.webp({ effort: 3 })
				.toFile(path.join("public", fullPath));

			return fullPath;
		} catch (error) {
			console.error(error);
		}
	}
}
