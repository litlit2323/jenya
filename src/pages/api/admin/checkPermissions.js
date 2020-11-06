

import apiRoutesHandler from "@utils/apiRoutesHandler"
import withDb from "@utils/dbConnect"
import User from "./../../../models/User"

import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication} from "@utils/callbackHandlerApiFunctions"

export default apiRoutesHandler(
    withDb({
        GET: callbackHandlerApi([checkAuthentication], async (req, res, session) => {
            try {
                const user = await User.findById(session.userId).populate("permissions")
                if (!user) return res.status(404).json({errors: {name: "common", message: "Пользователь не найден."}})
                const userHavePermissions = user.permissions.find(permission => {
                    return permission.title === "Администратор"
                })

                res.json({user:{isAdmin: !!userHavePermissions}})
            } catch (e) {
                console.log("error here")
                console.log(e)
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        })
    })
)

