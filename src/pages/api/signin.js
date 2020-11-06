import {compare} from "bcrypt"



import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import User from './../../models/User'

import {secret} from "@utils/secret"
import cookie from "cookie"
import dbErrorCompile from "@utils/dbErrorCompile"
import {v4 as uuidv4} from "uuid"
import withSession from "@utils/withSession"


export default apiRoutesHandler(
    withDb({
        POST: withSession(async (req, res) => {
            try {
                if (req.session.get("authToken")) return res.status(400).json({
                    errors: [{name:"common", message: "Вы уже авторизованы.", payload: {user: {isLoggedIn: true}}}]
                })
                const {email, password} = req.body
                const user = await User.findOne({email: email}).populate("permissions")

                if (user) {

                    const isCorrect = await compare(password, user.password)
                    if (isCorrect) {
                        const sessionId = uuidv4()
                        user.tokens.addToSet(sessionId)
                        await user.save()
                        const claims = {
                            sessionId: sessionId,
                            permissions: user.permissions,
                            userId: user._id,
                            isLoggedIn: true
                        }
                        req.session.set("authToken", claims)
                        await req.session.save()
                        console.log("Отправляем сессию.")
                        return res.json({success:{message: "Вы успешно авторизовались.", payload: {user: {isLoggedIn: true}}}})
                    }
                }
                return res.status(400).json({
                    errors:[{name: "common", message: "Неправильный email или пароль."}]
                })
            } catch (e) {
                res.status(500).json({error: [{name: 'common', message: e.message}]})
            }
        })
    })
)
