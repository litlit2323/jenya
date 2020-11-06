import withSession from "@utils/withSession";
import axios from "@utils/axios";

export const redirectIfNotAuth = withSession(async function ({req, res}) {
    const user = req.session.get('authToken')
    if (user === undefined) {
        res.setHeader('location', '/signin')
        res.statusCode = 302
        res.end()
        return {props: {}}
    }

    return {
        props: {user: req.session.get('authToken')},
    }
})
// '/api/admin/checkPermissions', async (url) => axios.get(url).then(res => res.data.user).catch(error => error.response.data.user)
export const redirectIfNotAdmin = withSession(async function ({req, res}) {
    const user = req.session?.get('authToken')

    const isAdmin = user?.permissions.find(permission => {
        return permission.title === "Администратор"
    })

    if (user === undefined || !isAdmin) {
        res.setHeader('location', '/signin')
        res.statusCode = 302
        res.end()
        return {props: {}}
    }

    return {
        props: {user: req.session.get('authToken')},
    }
})