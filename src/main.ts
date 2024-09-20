import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: { credentials: true, origin: true },
	});
	app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
	app.useGlobalPipes(new ValidationPipe());
	app.useStaticAssets(join(__dirname, "..", "public"));
	// app.enableCors({
	// 	allowedHeaders: ['Content-Type', 'Authorization'],
	// 	credentials: true,
	// 	methods: "*",
	// 	origin: ["localhost"],
	// 	preflightContinue: true,
	// });
	SwaggerModule.setup(
		"docs",
		app,
		SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle("Documents")
				.setVersion("1.0.0")
				.addTag("users")
				.addTag("auth")
				.addTag("admin")
				.addTag("payment")
				.addTag("booking")
				.addTag("room")
				.addBearerAuth()
				.build(),
		),
		{
			customSiteTitle: "API's",
		},
	);
	await app.listen(process.env.PORT);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
