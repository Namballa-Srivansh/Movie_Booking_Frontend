export const createMovie = async (movieData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(movieData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.err || errorData.message || `Failed to create movie: ${response.status}`;
        throw new Error(errorMessage);
    }

    return await response.json();
};

export const getAllMovies = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/movies`, {
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

export const updateMovie = async (id: string, movieData: any, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/movies/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
        body: JSON.stringify(movieData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update movie: ${response.status}`);
    }

    return await response.json();
};

export const getMovieById = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/movies/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movie: ${response.status}`);
    }

    return await response.json();
};

export const deleteMovie = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/movies/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete movie: ${response.status}`);
    }

    return await response.json();
};
