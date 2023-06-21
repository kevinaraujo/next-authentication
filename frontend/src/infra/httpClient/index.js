import { tokenService } from "../../services/auth/tokenService";

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
            status: res.status,
            statusText: res.statusText,
            body: await res.json()
        }
    })
    .then(async (res) => {
        if (!options.refresh) return res;
        if (res.status !== 401) return res;

        console.log('Middleware: Tentar atualizar com o refresh');
        // [Tentar atualizar os tokens]
        const refreshResponse = await httpClient('http://localhost:3000/api/refresh', {
            method: 'GET'
        });

        const newAccessToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;

        // [ Guarda os Tokens]
        tokenService.save(newAccessToken);

        // [Tentar rodar o request anterior]
        const retryResponse = await httpClient(fetchUrl, {
            ...options,
            refresh: false,
            headers: {
                'Authorization' : `Bearer ${newAccessToken}`
            }
        })
        
        return retryResponse;
    });
}