import { authService } from './authService';

//Decorator Pattern
export function withSession(func) {
    return async (ctx) => {
        try {
            const session = await authService.getSession(ctx);

            console.log(ctx);
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
