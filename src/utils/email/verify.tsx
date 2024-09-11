import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";
import tailwindConfig from "./tailwind.config";

export default function VerifyEmail({ code, oauth }: VerifyEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Head />
			<Preview>Account verification email</Preview>
			<Body>
				<Tailwind config={tailwindConfig}>
					<Container className="bg-white font-sans py-4">
						<Img
							src={`${process.env.APPLICATION_BASE_URL}/email/shiroko_logo.jpg`}
							width={128}
							className="mx-auto rounded-full"
							alt="Shiroko Logo"
						/>

						<Section align="center" className="text-center">
							<Heading as="h2" className="font-medium text-slate-800">
								Verification Email Send From Shiroko
							</Heading>
							<Text className="font-medium text-slate-800">Let's verify your email</Text>
						</Section>

						<Section align="center" className="shadow-xl rounded-xl overflow-hidden w-96">
							<Img
								src={`${process.env.APPLICATION_BASE_URL}/email/shiroko_banner.jpg`}
								className="w-full"
								alt="Shiroko Banner"
							/>
							<Section className="px-6">
								<Heading as="h3" className="mb-2 font-medium text-slate-800">
									Verify your new account!
								</Heading>
								<Text className="mt-2 text-slate-800">
									You are receiving this email because we need you to verify this email.
								</Text>
								<Text className="mt-2 text-slate-800">
									To complete the verification process please use the code below or{" "}
									<Link href={oauth}>click this url</Link>.
								</Text>
								<Section className="text-center mt-2 bg-slate-200 rounded-xl">
									<Text className="text-xl font-bold text-slate-800">{code}</Text>
								</Section>
								<Text className="mt-2 text-slate-800">
									This email is valid for <strong>5 minutes</strong>. If you don't request this,
									please ignore this email.
								</Text>
							</Section>
						</Section>

						<Text className="text-sm text-center text-slate-800">
							© {new Date().getFullYear()} Copyright by{" "}
							<Link href={process.env.APPLICATION_BASE_URL}>Sunaookami Shiroko</Link>
						</Text>
					</Container>
				</Tailwind>
			</Body>
		</Html>
	);
}
