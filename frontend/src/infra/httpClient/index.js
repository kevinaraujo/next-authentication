export function httpClient(fetchUrl, options) {
    const opt = {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json'
        },
        body: options.body ? JSON.stringify(options.body) : null
    };
    
    return fetch(fetchUrl, opt)
    .then(async (res) => {
        return {
            ok: res.ok,
            body: await res.json()
        }
    })
}