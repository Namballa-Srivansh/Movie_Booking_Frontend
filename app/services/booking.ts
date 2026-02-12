
export const createBooking = async (bookingData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create booking: ${response.status}`);
    }

    return await response.json();
};

export const getBookings = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch bookings: ${response.status}`);
    }

    return await response.json();
};
