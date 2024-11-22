import { CookieOptions } from "express";
import { createTransport } from "nodemailer";

export const cookieConfigs: CookieOptions = {
	domain: process.env.DOMAIN,
	path: "/",
	httpOnly: true,
	secure: true,
	signed: true,
	sameSite: "none",
	expires: new Date(Date.now() + 99999999999),
};

export const transporter = createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});
