import { tokenService } from "../src/services/auth/tokenService";
import nookies from 'nookies';
import { authService } from "../src/services/auth/authService";

export async function getServerSideProps(ctx) {
   try {
    const session = await authService.getSession(ctx);
    console.log('session', session);
 
     return {
         props: {
             session
         }
     }
   } catch (err) {
        return {
            redirect: {
                permanent: false,
                destination: '/?error=401'
            }
        }
   }
}

function AuthPageSSR(props) {

    return (
        <div>
            <h1>
                Auth Page SSR
            </h1>
            <pre>
                { JSON.stringify(props, null, 2) }
            </pre>
        </div>
    )
}

export default AuthPageSSR