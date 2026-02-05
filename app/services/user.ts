export const getUserById = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
};
