
export async function apiFetch(endpoint, options = {}) {

    const url = endpoint.startsWith('http') ? endpoint : BASE_URL + endpoint;
    // console.log('Url ::', url);
    // console.log('Endpoint  ::', endpoint);
    // console.log('Type  ::', endpoint === url);


    // console.log('Options headers --> ', options.headers);
    // console.log('Options ::', {
    //   ...options,
    //   headers : {
    //     'test' : 'lol'
    //   }
    // });

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
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
