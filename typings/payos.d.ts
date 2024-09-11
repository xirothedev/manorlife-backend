interface PayOSCreatePaymentResponse {
	code: string;
	desc: string;
	data?: {
		bin: string;
		accountNumber: string;
		accountName: string;
		amount: number;
		description: string;
		orderCode: number;
		currency: string;
		paymentLinkId: string;
		status: string;
		expiredAt: number;
		checkoutUrl: string;
		qrCode: string;
	};
}
