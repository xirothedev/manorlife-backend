export function generateOTP(length: number = 6) {
	const digits = "0123456789";
	let OTP = "";
	for (let i = 0; i < length; i++) {
		OTP += digits[Math.floor(Math.random() * digits.length)];
	}

	return OTP;
}

export function isValidNumber(
	number: number,
	{ max, min, positive, negative }: { max?: number; min?: number; positive?: boolean; negative?: boolean },
) {
	if (!number) return false;
	if (max < number) return false;
	if (min > number) return false;
	if (positive && number <= 0) return false;
	if (negative && number >= 0) return false;

	return true;
}

export function createString(length: number = 6) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}
