import apiRoutesHandler from "@utils/apiRoutesHandler"
import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication} from "@utils/callbackHandlerApiFunctions"

import User from "./../../../models/User"
import dbErrorCompile from "@utils/dbErrorCompile";
import validateData from "@validation/validator";


import {userSchemaValidation} from "@validation/schemes"


export default apiRoutesHandler({
    GET: callbackHandlerApi([checkAuthentication], async (req, res, session) => {
            try {
                if (!session) {
                    return res.status(401).json({errors:{name:"Common", message:"Вы не авторизованы.", payload:{user:{isLoggedIn: false}}}})
                }

                const user = await User.findById(session.userId).select("-tokens -permissions -password -__v").lean()
                return res.json({success:{message:"Вы авторизованы.", payload:{user:{isLoggedIn: true, ...user}}}})
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        }
    ),
    POST:
        callbackHandlerApi([checkAuthentication], async (req, res, session) => {
            try {
                const data = req.body

                if (!session) {
                    return res.status(403).json({errors: [{name: 'common', message: "Пользователя не найдено."}]})
                }

                const potentialErrors = validateData(data, userSchemaValidation.accountPost)
                if (potentialErrors.length !== 0) return res.status(422).json({errors: potentialErrors})

                await User.findByIdAndUpdate(session.userId, {$set: data}, {runValidators: true}, (err, doc) => {
                    if (err) {
                        return dbErrorCompile(err, res)
                    }
                    res.json({success: {name: "common", message: "Данные успешно изменены."}})
                    return doc
                })
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        })
})


