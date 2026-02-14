export const signupUser = async (userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Signup failed");
    }

    return data;
};

export const loginUser = async (userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
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
        const errorData = await response.json().catch(() => ({}));
        console.error("Verification Error Details:", errorData);
        throw new Error(errorData.message || errorData.err || `User verification failed with status: ${response.status}`);
    }

    return await response.json();
};
