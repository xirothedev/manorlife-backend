import { Module } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { BranchController } from "./branch.controller";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MediaSerivce } from "src/media.service";

@Module({
	providers: [BranchService, PrismaService, JwtService, MediaSerivce],
	controllers: [BranchController],
})
export class BranchModule {}
