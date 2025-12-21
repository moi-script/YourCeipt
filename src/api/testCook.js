
const fetchCookie = async() => {
    const res = await fetch('http://localhost:3000/user/register', {
        credentials: 'include'
    })

    const data = await res.json();

    return data;

}

console.log('Cookie res -->', await fetchCookie());