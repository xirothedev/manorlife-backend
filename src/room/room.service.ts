import { Injectable } from "@nestjs/common";
import { unlink } from "fs/promises";
import path from "path";
import { BadRequestException, InternalServerErrorException } from "src/exception";
import { MediaSerivce } from "src/media.service";
import { PrismaService } from "src/prisma.service";
import { CreateRoomDto, EditRoomDto } from "./room.dto";

@Injectable()
export class RoomService {
	constructor(
		private prisma: PrismaService,
		private media: MediaSerivce,
	) {}

	async getAllRooms() {
		const data = await this.prisma.room.findMany();

		return {
			message: `Đã lấy ${data.length} phòng thành công`,
			data,
		};
	}

	async getRoom(param: string) {
		const data = await this.prisma.room.findUnique({ where: { room_id: param } });

		if (!data) {
			new BadRequestException({ message: "Không tìm thấy phòng" });
		}

		return {
			message: `Đã lấy phòng thành công`,
			data,
		};
	}

	async createRoom(body: CreateRoomDto, images: Array<Express.Multer.File>) {
		const branch = await this.prisma.branch.findFirst({
			where: { branch_id: body.branch_id },
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
				images: files.filter((f) => f),
				bed_type: body.bed_type,
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

		const files = room.images;

		const deletedImages = files.filter((oldImage) => !body.existing_urls.includes(oldImage));

		try {
			await Promise.all(
				deletedImages.map((image) =>
					unlink(path.join("public", image)).catch((error) =>
						console.error(`Failed to delete image ${image}:`, error),
					),
				),
			);

			const newImages = await Promise.all(
				images.map(async (file) => {
					try {
						return await this.media.transform(file);
					} catch (error) {
						console.error(`Failed to process image ${file.originalname}:`, error);
						return null;
					}
				}),
			);

			room.images = [...body.existing_urls, ...newImages.filter((img) => img !== null)];

			const data = await this.prisma.room.update({
				where: { room_id: body.room_id },
				data: {
					name: body.name,
					description: body.description,
					price_per_month: body.price_per_month,
					price_per_night: body.price_per_night,
					stock: body.stock,
					room_id: branch.branch_id,
					images: room.images,
				},
			});

			return {
				message: "Sửa phòng thành công",
				data,
			};
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException({ message: "Server gặp vấn đề khi xử lý request" });
		}
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
