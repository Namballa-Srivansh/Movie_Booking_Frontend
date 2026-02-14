export const getOptimizedImageUrl = (url: string | undefined, type: 'thumbnail' | 'poster' | 'background' | 'original' = 'original') => {
    if (!url) return "";
    if (!url.includes("cloudinary.com")) return url;

    // Split the URL at 'upload/'
    const [baseUrl, imagePath] = url.split("upload/");
    if (!imagePath) return url;

    let transformations = "";

    switch (type) {
        case 'thumbnail':
            transformations = "w_200,h_200,c_fill,q_auto,f_auto";
            break;
        case 'poster':
            transformations = "w_500,q_auto,f_auto";
            break;
        case 'background':
            transformations = "w_4000,h_2000,q_auto:best,f_auto,e_blur:200"; 
            break;
        case 'original':
        default:
            transformations = "q_auto,f_auto";
            break;
    }

    return `${baseUrl}upload/${transformations}/${imagePath}`;
};
