// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import {withIronSession} from 'next-iron-session'

export default function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.SECRET,
        // if your localhost is served on http:// then disable the secure flag
        cookieName: "authToken",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    })
}