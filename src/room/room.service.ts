import { Injectable } from "@nestjs/common";
import { unlink } from "fs/promises";
import path from "path";
import { BadRequestException } from "src/exception";
import { MediaSerivce } from "src/media.service";
import { PrismaService } from "src/prisma.service";
import { CreateRoomDto, EditRoomDto } from "./room.dto";

@Injectable()
export class RoomService {
	constructor(
		private prisma: PrismaService,
		private media: MediaSerivce,
	) {}

	async getRoom(param: string) {
		const data = await this.prisma.room.findMany({ where: { branch: { url: param } } });

		return {
			message: `Đã lấy ${data.length} phòng thành công`,
			data,
		};
	}

	async createRoom(body: CreateRoomDto, images: Array<Express.Multer.File>) {
		const branch = await this.prisma.branch.findFirst({
			where: { OR: [{ branch_id: body.branch }, { name: body.branch }] },
		});

		if (!branch) {
			throw new BadRequestException({ message: "Chi nhánh không tồn tại" });
		}

		if (!images || images.length === 0) {
			throw new BadRequestException({ message: "Vui lòng cung cấp hình ảnh" });
		}

		const files = await Promise.all(images.map(this.media.transform));

		const data = await this.prisma.room.create({
			data: {
				name: body.name,
				description: body.description,
				acreage: +body.acreage,
				price_per_month: +body.price_per_month,
				price_per_night: +body.price_per_night,
				stock: +body.stock,
				comforts: body.comforts,
				branch_id: branch.branch_id,
				max_adults: +body.max_adults,
				max_children: +body.max_children,
				max_babies: +body.max_babies,
				images: files,
				bed_type: body.bed_type,
				status: body.status,
				available_from: new Date(+body.available_from),
				available_to: new Date(+body.available_to),
			},
		});

		return {
			message: "Tạo phòng thành công",
			data,
		};
	}

	async editRoom(body: EditRoomDto, images: Array<Express.Multer.File>) {
		const room = await this.prisma.room.findUnique({ where: { room_id: body.room_id } });

		if (!room) {
			throw new BadRequestException({ message: "Phòng không tồn tại" });
		}

		const branch = await this.prisma.branch.findFirst({
			where: { OR: [{ branch_id: body.branch }, { name: body.branch }] },
		});

		if (!branch) {
			throw new BadRequestException({ message: "Chi nhánh không tồn tại" });
		}

		if (!images || images.length === 0) {
			throw new BadRequestException({ message: "Vui lòng cung cấp hình ảnh" });
		}

		await Promise.all(room.images.map(async (image) => await unlink(path.join("public", image))));

		const files = await Promise.all(images.map(this.media.transform));

		const data = await this.prisma.room.update({
			where: { room_id: body.room_id },
			data: {
				name: body.name,
				description: body.description,
				price_per_month: body.price_per_month,
				price_per_night: body.price_per_night,
				stock: body.stock,
				branch_id: branch.branch_id,
				images: files,
			},
		});

		return {
			message: "Sửa phòng thành công",
			data,
		};
	}

	async deleteRoom(param: string) {
		const room = await this.prisma.room.findUnique({ where: { room_id: param } });

		if (!room) {
			throw new BadRequestException({ message: "Phòng không tồn tại" });
		}

		await this.prisma.room.delete({ where: { room_id: param } });

		return {
			message: "Xóa phòng thành công",
		};
	}
}
