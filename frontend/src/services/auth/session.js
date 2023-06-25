import { authService } from './authService';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

//Decorator Pattern
export function withSession(func) {
    return async (ctx) => {
        try {
            const session = await authService.getSession(ctx);

            const modifiedContext = { 
                ...ctx,
                req: {
                    ...ctx.req,
                    session
                }
            };

            return func(modifiedContext)
        } catch (err) {
                return {
                    redirect: {
                        permanent: false,
                        destination: '/?error=401'
                    }
                }
        }
    }
}

export function useSession() {
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

export function withSessionHOC(Component) {
    return function Wrapper(props) {
        const router = useRouter();
        const session = useSession();
        
        if (!session.loading && session.error) {
            console.log('redirect');
            router.push('/?error=401');
        }

        const modifiedProps = {
            ...props,
            session: session.data
        }

        return (
            <Component {...modifiedProps} />
        )
    }
}