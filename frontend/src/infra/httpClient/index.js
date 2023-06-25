import { tokenService } from "../../services/auth/tokenService";
import nookies from 'nookies';

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

        const isServer = Boolean(options.ctx); console.log('isServer', isServer);
        const currentRefreshToken = options.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];
         
        console.log('Middleware: Tentar atualizar com o refresh');

        try {
            // [Tentar atualizar os tokens]
            const refreshResponse = await httpClient('http://localhost:3000/api/refresh', {
                method: isServer ? 'PUT' : 'GET',
                body: isServer ? { refresh_token: currentRefreshToken } : undefined
            });

            const newAccessToken = refreshResponse.body.data.access_token;
            const newRefreshToken = refreshResponse.body.data.refresh_token;

            // [ Guarda os Tokens]
            if (isServer) {
                nookies.set(options.ctx, 'REFRESH_TOKEN_NAME', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/'
                });
            }
            
            tokenService.save(newAccessToken);

            
            // [Tentar rodar o request anterior]
            const retryResponse = await httpClient(fetchUrl, {
                ...options,
                refresh: false,
                headers: {
                    'Authorization' : `Bearer ${newAccessToken}`
                }
            })
            console.log('retryResponse', retryResponse);
            return retryResponse;
        } catch (err) {
            console.log(err);
            return err;
        }

        
    });
}