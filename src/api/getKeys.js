

export const getCloudName = () => import.meta.env.VITE_CLOUD_NAME;

const getBaseApiUrl = (type) => {
    return type === 'local' ? 'http://localhost:3000' : import.meta.env.VITE_URL_BACKEND 
}

export const BASE_API_URL = getBaseApiUrl('local');  


export const getAiDefaultModel = () => import.meta.env.VITE_AI_DEFAULT_MODEL;
// console.log(getCloudName());