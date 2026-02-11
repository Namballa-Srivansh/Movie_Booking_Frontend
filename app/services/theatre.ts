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

export const getAllTheatres = async (page?: number, limit?: number) => {
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres`;
    if (page && limit) {
        url += `?page=${page}&limit=${limit}`;
    }

    const response = await fetch(url, {
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

export const addMoviesToTheatre = async (theatreId: string, movieIds: string[], token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${theatreId}/movies`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({
            movieIds,
            insert: true
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add movies to theatre: ${response.status}`);
    }

    return await response.json();
};

export const removeMoviesFromTheatre = async (theatreId: string, movieIds: string[], token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${theatreId}/movies`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({
            movieIds,
            insert: false
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to remove movies from theatre: ${response.status}`);
    }

    return await response.json();
};

export const getMoviesByTheatreId = async (theatreId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${theatreId}/movies`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
    }

    return await response.json();
};

export const getTheatreById = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch theatre: ${response.status}`);
    }

    return await response.json();
};

export const deleteTheatre = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete theatre: ${response.status}`);
    }

    return await response.json();
};

export const updateTheatre = async (id: string, theatreData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/theatres/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
        body: JSON.stringify(theatreData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update theatre: ${response.status}`);
    }

    return await response.json();
};


