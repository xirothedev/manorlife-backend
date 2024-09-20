import { renderAsync } from "@react-email/components";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import VerifyEmail from "./verify";
import { transporter } from "src/configs";
import RecoveryEmail from "./recovery";
import PasswordEmail from "./password";

export async function sendVerificationEmail(address: string, props: VerifyEmailProps) {
	const emailHtml = await renderAsync(VerifyEmail(props));

	const sendEmailOption: MailOptions = {
		from: process.env.EMAIL_ADDRESS,
		subject: "Account Verification",
		html: emailHtml,
		sender: "Sunaookami Shiroko",
		to: address,
	};

	await transporter.sendMail(sendEmailOption, (err, info) => {
		console.log(err, info);
	});
}

export async function sendRecoveryEmail(address: string, props: RecoveryEmailProps) {
	const emailHtml = await renderAsync(RecoveryEmail(props));

	const sendEmailOption: MailOptions = {
		from: process.env.EMAIL_ADDRESS,
		subject: "Account Recovery",
		html: emailHtml,
		sender: "Sunaookami Shiroko",
		to: address,
	};

	await transporter.sendMail(sendEmailOption, (err, info) => {
		console.log(err, info);
	});
}

export async function sendPasswordEmail(address: string, props: PasswordProps) {
	const emailHtml = await renderAsync(PasswordEmail(props));

	const sendEmailOption: MailOptions = {
		from: process.env.EMAIL_ADDRESS,
		subject: "New password",
		html: emailHtml,
		sender: "Sunaookami Shiroko",
		to: address,
	};

	await transporter.sendMail(sendEmailOption, (err, info) => {
		console.log(err, info);
	});
}