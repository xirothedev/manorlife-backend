import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	providers: [PrismaService, AuthService, JwtService, PrismaService],
	controllers: [AuthController]
})
export class AuthModule {}
