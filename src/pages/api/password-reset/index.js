import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import User from "./../../../models/User"
import {v4 as uuidv4} from "uuid"
import AccessHash from "../../../models/AccessHash"
import {sendResetPasswordMailToUser} from "@utils/mailer"

export default apiRoutesHandler(
    withDb({
        POST: async (req, res) => {
            try {
                const {email} = req.body
                if (!email) {
                    return res.status(422).json({
                        errors: [{
                            name: "common",
                            message: "Укажите email для восстановления аккаунта."
                        }]
                    })
                }
                const hash = uuidv4()
                const user = await User.findOne({email:email})
                if (!user) {
                    return res.status(422).json({
                        errors: [{
                            name: 'common',
                            message: "Пользователь с указанным email не найден."
                        }]
                    })
                }
                console.log("Нашли пользователя, создаём хеш.")
                const hashLink = await AccessHash({user: user._id, hash: hash})
                hashLink.save()

                await sendResetPasswordMailToUser(email, hash)
                res.json({
                    success: {
                        name: 'common',
                        message: "На указанный адрес выслано письмо с инструкциями по восстановлению пароля."
                    }
                })
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        },
    })
)
