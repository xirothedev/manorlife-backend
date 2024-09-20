import { Injectable, PipeTransform } from "@nestjs/common";
import * as path from "path";
import * as sharp from "sharp";
import { BadRequestException } from "./exception";

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
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