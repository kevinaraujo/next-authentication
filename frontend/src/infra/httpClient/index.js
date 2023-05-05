export function httpClient(fetchUrl, fetchOptions) {
    return fetch(fetchUrl, {
        ...fetchOptions,
        headers: {
            ...fetchOptions.headers,
            'Content-Type': 'application/json'
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null
    })
    .then(async (res) => {
        return {
            ok: res.ok,
            body: await res.json()
        }
    })
}