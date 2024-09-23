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

interface PayOSGetPaymentData {
	code: string;
	desc: string;
	data?: {
		id: string;
		orderCode: number;
		amount: number;
		amountPaid: number;
		amountRemaining: number;
		status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
		createdAt: string;
		transactions: any[];
		cancellationReason: string | null;
		canceledAt: string | null;
	};
	signature: string;
}
