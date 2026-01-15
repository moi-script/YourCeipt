const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


const fetchCookie = async() => {
    const res = await fetch(BASE_API_URL + '/user/register', {
        credentials: 'include'
    })

    const data = await res.json();

    return data;

}

console.log('Cookie res -->', await fetchCookie());