
export async function apiFetch(endpoint, options = {}) {

    const url = endpoint.startsWith('http') ? endpoint : BASE_URL + endpoint;
    console.log('Url ::', url);
    console.log('Options ::', options);

    const defaultHeaders = {
    'Content-Type': 'application/json', // <--- REQUIRED for express.json()
  };

  const res = await fetch(url, {
    credentials: "include", 
    headers: {
        ...defaultHeaders,
      ...options.headers
    },
    ...options
  });

  if (!res.ok) throw res;
//   console.log('Res json :; ', await res.json())

try {
    const data = await res.json();
    console.log('Data ::', data);
    return data;
} catch(err) {
    console.error('Error in data :: ', err);
}
}
