export async function apiFetch(endpoint, options = {}) {

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw res;
  //   console.log('Res json :; ', await res.json())

  try {
    const data = await res.json();
    console.log("Data ::", data);
    return data;
  } catch (err) {
    console.error("Error in data :: ", err);
  }
}

export async function loginFetch(endpoint, options = {}) {
  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw res;

  try {
    const data = await res.json();
    console.log("Data ::", data);
    return data;
  } catch (err) {
    console.error("Error in data :: ", err);
  }
}
