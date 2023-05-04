export const authService =  {
    async login({ username, password }) {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(async (res) => {
            if(!res.ok) {
                throw new Error('Invalid username or password');
            }

            const body = await res.json();
            console.log('@body', body);
        })
    }
}