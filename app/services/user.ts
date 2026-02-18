export const getUserById = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
};

export const updateUser = async (id: string, token: string, data: any) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/user/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(data),
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update user: ${response.status}`);
    }

    return await response.json();
};

export const getAllUsers = async (token: string, status?: string) => {
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/users`;
    if (status) {
        url += `?userStatus=${status}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch users: ${response.status}`);
    }

    return await response.json();
};
