import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
	providers: [PrismaService, AdminService, JwtService, PrismaService],
	controllers: [AdminController],
})
export class AdminModule {}
