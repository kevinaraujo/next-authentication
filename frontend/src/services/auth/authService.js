import { httpClient } from "../../infra/httpClient";

export const authService =  {
    async login({ username, password }) {
        return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
            method: 'POST',
            body: {
                username,
                password
            }
        })
        .then((res) => {
            
            console.log('@res', res);
        })
    }
}