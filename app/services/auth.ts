export const signupUser = async (userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    return await response.json();
};

export const loginUser = async (userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    return await response.json();
};

export const verifyUser = async (userData: any) => {
    // Robust token extraction: Check top-level OR nested data object
    const token = userData?.accessToken || userData?.token || userData?.data?.accessToken || userData?.data?.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/user/verify`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
    });

    if (!response.ok) {
        throw new Error(`User verification failed with status: ${response.status}`);
    }

    return await response.json();
};
