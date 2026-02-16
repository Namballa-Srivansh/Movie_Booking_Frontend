export const searchAll = async (query: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mba/api/v1/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Search service error:", error);
        throw error;
    }
};
