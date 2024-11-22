import { Injectable } from "@nestjs/common";
import { unlink } from "fs/promises";
import * as path from "path";
import { BadRequestException, InternalServerErrorException } from "src/exception";
import { MediaSerivce } from "src/media.service";
import { PrismaService } from "src/prisma.service";
import { CreateBranchDto, EditBranchDto, GetBranchsDto } from "./branch.dto";

@Injectable()
export class BranchService {
	constructor(
		private prisma: PrismaService,
		private media: MediaSerivce,
	) {}

	async getBranchs(body: GetBranchsDto) {
		const branchs = await this.prisma.branch.findMany({
			where: {
				province: body.province ?? undefined,
				trademark: body.trademark ?? undefined,
				rooms: {
					some: {
						available_from: { lte: body.from ?? undefined, not: null },
						available_to: { gte: body.to ?? undefined, not: null },
						max_adults: { gte: body.adults ?? undefined },
						max_children: { gte: body.children ?? undefined },
						max_babies: { gte: body.babies ?? undefined },
					},
				},
			},
			include: { rooms: true },
		});

		const filter =
			body.wards && body.wards.length !== 0 ? branchs.filter((f) => body.wards.includes(f.ward)) : branchs;

		if (body.sort) {
			if (body.sort === "asc") {
				filter.forEach((item) => {
					item.rooms.sort((a, b) => a.price_per_night - b.price_per_night);
				});

				filter.sort((a, b) => {
					const minPriceA = a.rooms[0]?.price_per_night || 0;
					const minPriceB = b.rooms[0]?.price_per_night || 0;
					return minPriceA - minPriceB;
				});
			} else if (body.sort === "desc") {
				filter.forEach((item) => {
					item.rooms.sort((a, b) => b.price_per_night - a.price_per_night);
				});

				filter.sort((a, b) => {
					const maxPriceA = a.rooms[0]?.price_per_night || 0;
					const maxPriceB = b.rooms[0]?.price_per_night || 0;
					return maxPriceB - maxPriceA;
				});
			} else {
				filter.forEach((item) => {
					item.rooms.sort((a, b) => b.booking_turn - a.booking_turn);
				});

				filter.sort((a, b) => {
					const maxPriceA = a.rooms[0]?.booking_turn || 0;
					const maxPriceB = b.rooms[0]?.booking_turn || 0;
					return maxPriceB - maxPriceA;
				});
			}
		}

		return {
			message: `Đã lấy ${filter.length} chi nhánh thành công`,
			data: filter,
		};
	}

	async getBranch(param: string) {
		const data = await this.prisma.branch.findUnique({
			where: { url: param },
			include: { rooms: true, surrounding_area: true },
		});

		if (!data) {
			new BadRequestException({ message: "Không tìm thấy phòng" });
		}

		return {
			message: `Đã lấy ${data?.rooms?.length || 0} phòng thành công`,
			data: data,
		};
	}

	async getAllBranchs() {
		const branchs = await this.prisma.branch.findMany();

		return {
			message: `Đã lấy ${branchs.length} chi nhánh thành công`,
			data: branchs,
		};
	}

	async createBranch(body: CreateBranchDto, images: Array<Express.Multer.File>) {
		const branch = await this.prisma.branch.findFirst({
			where: { OR: [{ name: body.name }, { url: body.url }, { trademark: body.trademark }] },
		});

		if (branch) {
			if (branch.url === body.url) {
				throw new BadRequestException({ message: "Đường dẫn đã tồn tại" });
			}

			if (branch.name === body.name) {
				throw new BadRequestException({ message: "Chi nhánh đã tồn tại" });
			}

			if (branch.trademark === body.trademark) {
				throw new BadRequestException({ message: "Thương hiệu đã tồn tại" });
			}
		}

		if (!images || images.length === 0) {
			throw new BadRequestException({ message: "Vui lòng cung cấp hình ảnh" });
		}

		const files = await Promise.all(images.map(this.media.transform));

		const data = await this.prisma.branch.create({
			data: {
				name: body.name,
				description: body.description,
				images: files.filter((f) => f),
				url: body.url,
				location: body.location,
				trademark: body.trademark,
				best_comforts: body.best_comforts,
				province: body.province,
				ward: body.ward,
				surrounding_area: { createMany: { skipDuplicates: true, data: body.surrounding_area } },
			},
		});

		return {
			message: "Tạo chi nhánh thành công",
			data,
		};
	}

	async editBranch(body: EditBranchDto, images: Array<Express.Multer.File>) {
		console.log(images);
		const branch = await this.prisma.branch.findUnique({ where: { branch_id: body.branch_id } });

		if (!branch) {
			throw new BadRequestException({ message: "Chi nhánh không tồn tại" });
		}

		const currentImages = branch.images || [];
		const deletedImages = currentImages.filter((oldImage) => !body.existing_urls.includes(oldImage));

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

			branch.images = [...body.existing_urls, ...newImages.filter((img) => img !== null)];

			const updatedBranch = await this.prisma.branch.update({
				where: { branch_id: body.branch_id },
				data: {
					name: body.name,
					description: body.description,
					images: branch.images,
					location: body.location,
					trademark: body.trademark,
					best_comforts: body.best_comforts,
					province: body.province,
					ward: body.ward,
					surrounding_area: {
						deleteMany: {},
						createMany: { data: body.surrounding_area },
					},
				},
			});

			return {
				message: "Sửa chi nhánh thành công",
				data: updatedBranch,
			};
		} catch (error) {
			console.error("Lỗi khi xử lý chi nhánh:", error);
			throw new InternalServerErrorException({ message: "Server gặp vấn đề khi xử lý request" });
		}
	}
	async deleteBranch(param: string) {
		const branch = await this.prisma.branch.findUnique({ where: { branch_id: param } });

		if (!branch) {
			throw new BadRequestException({ message: "Phòng không tồn tại" });
		}

		await this.prisma.branch.delete({ where: { branch_id: param } });

		return {
			message: "Xóa chi nhánh thành công",
		};
	}
}
