import { useRouter } from "next/router";
import { tokenService } from "../src/services/auth/tokenService"
import React from "react";
import { httpClient } from "../src/infra/httpClient";

export default function LogoutPage() {
    const router = useRouter();
    
    React.useEffect(async () => {
        try {
            const res = await httpClient('/api/refresh', {
                method: 'DELETE'
            });
            tokenService.delete();
            router.push('/');
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div>
            Você será redirecionado em instantes...
        </div>
    )
}