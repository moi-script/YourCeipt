

export const getCloudName = () => import.meta.env.VITE_CLOUD_NAME;

const getBaseApiUrl = (type) => {
    return type === 'local' ? 'http://localhost:3000' : import.meta.env.VITE_URL_BACKEND 
}

export const BASE_API_URL = getBaseApiUrl('production');  

// console.log(getCloudName());