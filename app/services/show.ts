export const createShow = async (showData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/shows`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(showData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create show: ${response.status}`);
    }

    return await response.json();
};

export const getAllShows = async (filters?: { movieId?: string; theatreId?: string }) => {
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/shows`;

    if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.movieId) queryParams.append("movieId", filters.movieId);
        if (filters.theatreId) queryParams.append("theatreId", filters.theatreId);
        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch shows: ${response.status}`);
    }

    return await response.json();
};

export const getShowById = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/shows/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch show: ${response.status}`);
    }

    return await response.json();
};

export const updateShow = async (id: string, showData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/shows/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(showData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update show: ${response.status}`);
    }

    return await response.json();
};

export const deleteShow = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/shows/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete show: ${response.status}`);
    }

    return await response.json();
};
