import nookies from 'nookies';
import { httpClient } from '../../src/infra/httpClient';
import { tokenService } from '../../src/services/auth/tokenService';

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
                sameSite: 'lax',
                path: '/'
            }
        );

        res.json({
            data: {
                message: 'Saved successfully!'
            }
        });        
    },
    async regenerateTokens(req, res) {
        const ctx = { req, res };
        const cookies = nookies.get(ctx);
        const refresh_token = cookies[REFRESH_TOKEN_NAME];

        const response = await httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
            method: 'POST',
            body: {
                refresh_token
            }
        });

        if (response.ok) {
            nookies.set(ctx, REFRESH_TOKEN_NAME, response.body.data.refresh_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            });

            tokenService.save(response.body.data.access_token, ctx);

            res.status(200).json({
                data: response.body.data
            });


        } else {
            res.status(401).json({
                status: 401,
                message: 'Not Authorized'
            });
        }
    },
    async displayCookies(req, res) {
        const ctx = { req, res };

        res.json({
            data: {
                cookies: nookies.get(ctx)
            }
        })
    },
}

const controllersBy = {
    POST: controllers.storeRefreshToken,
    GET: controllers.regenerateTokens
    // GET: controllers.displayCookies
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