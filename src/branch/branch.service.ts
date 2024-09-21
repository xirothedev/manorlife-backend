import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateBranchDto, EditBranchDto, GetBranchDto } from "./branch.dto";
import { BadRequestException } from "src/exception";
import { MediaSerivce } from "src/app.service";
import { unlink } from "fs/promises";
import path from "path";

@Injectable()
export class BranchService {
	constructor(
		private prisma: PrismaService,
		private media: MediaSerivce,
	) {}

	async getBranch(query: GetBranchDto) {
		const branchs = this.prisma.branch.findMany({
			where: { province: query.province, ward: query.ward, trademark: query.trademark },
			include: { rooms: true },
		});

		return {
			message: `Đã lấy ${branchs} chi nhánh thành công`,
			data: branchs,
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
