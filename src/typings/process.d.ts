declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: string;
		readonly DOMAIN: string;
		readonly DATABASE_URL: string;
		readonly COOKIE_SECRET_KEY: string;
		readonly ACCESS_TOKEN_SECRET_KEY: string;
		readonly REFRESH_TOKEN_SECRET_KEY: string;
		readonly AUTH_TOKEN_SECRET_KEY: string;
		readonly EMAIL_ADDRESS: string;
		readonly EMAIL_PASSWORD: string;
		readonly APPLICATION_BASE_URL: string;
		readonly PAYMENT_CLIENT_ID: string;
		readonly PAYMENT_API_KEY: string;
		readonly PAYMENT_CHECKSUM_KEY: string;
	}
}
