export async function apiFetch(endpoint, options = {}) {

  const res = await fetch(endpoint, {
    // credentials: "include",
    headers: {
      ...options.headers,
    },
    ...options,
  });

  
  if (!res.ok) {
    console.log('Resopnse is not ok :(');
    throw res
  };

  return await res.json();

}

export async function loginFetch(endpoint, options = {}) {
  console.log('Using login fetch');
  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw res;

  return await res.json();
}
