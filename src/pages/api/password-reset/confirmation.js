


import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import AccessHash from './../../../models/AccessHash'
import User from './../../../models/User'
import dbErrorCompile from "@utils/dbErrorCompile";


const routeErrors = {}

export default apiRoutesHandler(
    withDb({
        POST: async (req, res) => {
            try {
                const {newPassword, hash} = req.body

                if (!newPassword) return res.status(422).json({
                    errors: [{
                        name: "common",
                        message: "Пожалуйста, укажите новый пароль."
                    }]
                })

                const userAccessHash = await AccessHash.findOne({hash})
                if (!userAccessHash) {
                    return res.status(404).json({
                        errors: [{
                            name: "common",
                            message: "Не был найден запрос на восстановление пароля."
                        }]
                    })
                }

                const user = await User.findById(userAccessHash.user)
                user.password = newPassword
                await user.save((err)=>{
                    if(err){
                        return dbErrorCompile(err, res)
                    }
                })
                await userAccessHash.remove()

                return res.json({success: {name: "common", message: "Пароль успешно сброшен."}})
            } catch (e) {
                res.status(500).json({errors: [{name: "common", message: e.message}]})
            }
        },
    })
)
