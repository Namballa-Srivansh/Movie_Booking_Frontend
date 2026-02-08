export const createTheatre = async (theatreData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(theatreData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create theatre: ${response.status}`);
    }

    return await response.json();
};

export const getAllTheatres = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch theatres: ${response.status}`);
    }

    return await response.json();
};
