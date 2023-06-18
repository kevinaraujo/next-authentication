import nookies from 'nookies';

const REFRESH_TOKEN_NAME = 'REFRESH_TOKEN_NAME';
const controllers = {
    async storeRefreshToken(req, res) {
        const ctx = { req, res };
        console.log('ress', req.body);

        nookies.set(
            ctx, 
            REFRESH_TOKEN_NAME, 
            req.body.refresh_token, 
            {
                httpOnly: true,
                sameSite: 'Lax'
            }
        );

        res.json({
            data: {
                message: 'Saved successfully!'
            }
        });        
    },
    async displayCookies(req, res) {
        const ctx = { req, res };

        res.json({
            data: {
                cookies: nookies.get(ctx)
            }
        })
    }
}

const controllersBy = {
    POST: controllers.storeRefreshToken,
    GET: controllers.displayCookies
}

export default function handler(req, res) {
    if(controllersBy[req.method]) {
        return controllersBy[req.method](req, res)
    }

    res.status(404).json({
        status: 404,
        message: 'Not Found'
    });
}