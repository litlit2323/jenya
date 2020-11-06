import React from 'react'
import Router from 'next/router'
import cookie from "cookie"

const login = '/signin?redirected=true' // Define your login route address.


const checkUserAuthentication = (token = null) => {
    return { authToken: token }
}

export default WrappedComponent => {

    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />
    hocComponent.getInitialProps = async ({ res, req }) => {

        const userAuth = req.headers.cookie ? await checkUserAuthentication(cookie.parse(req.headers.cookie).authToken) : await checkUserAuthentication(null)

        if (!userAuth?.authToken) {
            if (res) {
                res?.writeHead(302, {
                    Location: login,
                })
                res?.end()
            } else {
                await Router.replace(login)
            }
        } else if (WrappedComponent.getInitialProps) {
            const wrappedProps = await WrappedComponent.getInitialProps(userAuth)
            return { ...wrappedProps, userAuth }
        }
        return { userAuth }
    }

    return hocComponent
}