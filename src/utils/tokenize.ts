import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { cookieConfigs } from "src/configs";
import { PrismaService } from "src/prisma.service";

export const signNewSession = async (
	userId: string,
	res: Response,
	jwt: JwtService,
	prisma: PrismaService,
	extraData?: { agent?: string; ip?: string },
) => {
	const session = await prisma.session.create({
		data: { user_id: userId, device_data: extraData.agent },
		include: { user: { omit: { password: true } } },
	});

	const payload = {
		session_id: session.session_id,
		user_id: userId,
		email: session.user.email,
		phone: session.user.phone ?? "",
		sign_at: new Date(),
	};

	const accessToken = await jwt.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
	const refreshToken = await jwt.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET_KEY });

	res.cookie("access_token", accessToken, cookieConfigs);
	res.cookie("refresh_token", refreshToken, cookieConfigs);

	return {
		accessToken,
		refreshToken,
	};
};

export const refreshSession = async (sessionId: string, res: Response, jwt: JwtService, prisma: PrismaService) => {
	const session = await prisma.session.findUnique({
		where: { session_id: sessionId },
		include: { user: { omit: { password: true } } },
	});

	const payload = {
		session_id: session.session_id,
		user_id: session.user.user_id,
		email: session.user.email,
		phone: session.user.phone ?? "",
		sign_at: new Date(),
	};

	const accessToken = await jwt.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
	const refreshToken = await jwt.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET_KEY });

	res.cookie("access_token", accessToken, cookieConfigs);
	res.cookie("refresh_token", refreshToken, cookieConfigs);
};
