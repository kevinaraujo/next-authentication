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
            //if (!res.ok) throw new Error('Username or password invalid.');
            const { body } = res;
            
            console.log('@body', body.data.access_token);
            tokenService.save(body.data.access_token);
        })
    }
}