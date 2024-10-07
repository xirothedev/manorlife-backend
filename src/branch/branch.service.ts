import { Injectable } from "@nestjs/common";
import { unlink } from "fs/promises";
import path from "path";
import { BadRequestException } from "src/exception";
import { MediaSerivce } from "src/media.service";
import { PrismaService } from "src/prisma.service";
import { CreateBranchDto, EditBranchDto, GetBranchsDto } from "./branch.dto";

@Injectable()
export class BranchService {
	constructor(
		private prisma: PrismaService,
		private media: MediaSerivce,
	) {}

	async getBranch(query: GetBranchsDto) {
		const wards = query.ward?.split(",");
		const branchs = await this.prisma.branch.findMany({
			where: {
				province: query.province || undefined,
				trademark: query.trademark || undefined,
				rooms: {
					some: {
						available_from: { lte: query.from ? new Date(+query.from) : undefined, not: null },
						available_to: { gte: query.to ? new Date(+query.to) : undefined, not: null },
						max_adults: { gte: +query.adults || undefined },
						max_children: { gte: +query.children || undefined },
						max_babies: { gte: +query.babies || undefined },
						OR: [{ status: "available" }, { status: "almost_full" }],
					},
				},
			},
			include: { rooms: true },
		});

		const filter = wards ? branchs.filter((f) => wards.includes(f.ward)) : branchs;

		return {
			message: `Đã lấy ${branchs.length} chi nhánh thành công`,
			data: filter,
		};
	}

	async createBranch(body: CreateBranchDto, images: Array<Express.Multer.File>) {
		const branch = await this.prisma.branch.findUnique({
			where: { name: body.name },
		});

		if (branch) {
			throw new BadRequestException({ message: "Chi nhánh đã tồn tại" });
		}

		if (!images || images.length === 0) {
			throw new BadRequestException({ message: "Vui lòng cung cấp hình ảnh" });
		}

		const files = await Promise.all(images.map(this.media.transform));

		const data = await this.prisma.branch.create({
			data: {
				name: body.name,
				description: body.description,
				images: files,
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

	async editRoom(body: EditBranchDto, images: Array<Express.Multer.File>) {
		const branch = await this.prisma.branch.findUnique({ where: { branch_id: body.branch_id } });

		if (!branch) {
			throw new BadRequestException({ message: "Chi nhánh không tồn tại" });
		}

		if (!images || images.length === 0) {
			throw new BadRequestException({ message: "Vui lòng cung cấp hình ảnh" });
		}

		await Promise.all(branch.images.map(async (image) => await unlink(path.join("public", image))));

		const files = await Promise.all(images.map(this.media.transform));

		const data = await this.prisma.branch.update({
			where: { branch_id: body.branch_id },
			data: {
				name: body.name,
				description: body.description,
				images: files,
				location: body.location,
				trademark: body.trademark,
				best_comforts: body.best_comforts,
				province: body.province,
				ward: body.ward,
				surrounding_area: { createMany: { skipDuplicates: true, data: body.surrounding_area } },
			},
		});

		return {
			message: "Sửa chi nhánh thành công",
			data,
		};
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
