import { ROUTES } from "@/app/routes";

export const makePayment = async (amount: number, bookingId: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({ amount, bookingId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.err || `Payment failed: ${response.status}`);
    }

    return await response.json();
};
