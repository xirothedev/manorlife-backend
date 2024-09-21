import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma.service";
import { UsersController } from "./users.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
	providers: [UsersService, PrismaService, JwtService],
	controllers: [UsersController],
})
export class UsersModule {}
