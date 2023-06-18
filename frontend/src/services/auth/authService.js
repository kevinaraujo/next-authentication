import { httpClient } from "../../infra/httpClient";
import { tokenService } from './tokenService'

export const authService =  {
    async login({ username, password }) {
        return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
            method: 'POST',
            body: {
                username,
                password
            }
        })
        .then(async (res) => {
            if (!res.ok) throw new Error('Username or password invalid.');

            const { body } = res;
            tokenService.save(body.data.access_token);

            return body;
        })
        .then(async ({ data }) => {
            const { refresh_token } = data; 
            const res = await httpClient('/api/refresh', {
                method: 'POST',
                body: {
                    refresh_token
                }
            });
            console.log(res);
        })
    },
    async getSession(ctx = null) {
        const token = tokenService.get(ctx);

        return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Not Authorized.');
            return res.body.data;
        })
    }
}