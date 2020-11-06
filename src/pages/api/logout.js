
import apiRoutesHandler from "@utils/apiRoutesHandler"
import withDb from "@utils/dbConnect"
import User from "./../../models/User"
import dbErrorCompile from "@utils/dbErrorCompile"
import withSession from "@utils/withSession"



export default apiRoutesHandler(
    withDb({
        POST: withSession(async (req, res) => {
            try {
                const session = req.session.get("authToken")
                if(!session){
                    return res.status(400).send({errors:[{name:'common', message:"Вы уже вышли."}]})
                }

                const user = await User.findById(session.userId)
                if(!user){
                    return res.status(404).send({errors:[{name:'common', message:"Пользователя не найдено."}]})
                }
                user.tokens.pull(session.sessionId)
                await user.save((err) => {
                    if(err) {
                        return dbErrorCompile(err, res)
                    }
                })
                req.session.destroy()
                res.status(200).json({success:[{name:'common', message:"Вы успешно вышли из аккаунта"}]})
            }catch (e) {
                res.status(500).json({errors:[{name:'common', message:e.message}]})
            }
        })
    })

)

