import { useEffect, useState } from "react";
import { authService } from "../src/services/auth/authService";
import { useRouter } from 'next/router';
function useSession() {
    const [ session, setSession ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        authService
        .getSession()
        .then((userSession) => {
            setSession(userSession);
        })
        .catch((err) => {
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);

    return {
        data: session,
        error,
        loading
    }
}

function AuthPageStatic(props) {
    const router = useRouter();
    const session = useSession();

    if (!session.loading && session.error) {
        console.log('redirect');
        router.push('/?error=401');
    }
    return (
        <div>
            <h1>
                Auth Page Static
            </h1>
            <pre>
                { JSON.stringify(session, null, 2) }
            </pre>
        </div>
    )
}

export default AuthPageStatic