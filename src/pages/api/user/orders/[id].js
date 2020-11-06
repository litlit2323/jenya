import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"

import Order from "./../../../../models/Order"

import callbackHandlerApi from "@utils/callbackHandlerApi";
import {checkAuthentication} from "@utils/callbackHandlerApiFunctions"


import {secret} from "@utils/secret"


export default apiRoutesHandler(
    withDb({
        GET: callbackHandlerApi([checkAuthentication], async (req, res, session) => {
            try {
                const {query: {id}} = req
                if (!id) return res.status(403).json({
                    errors: [{
                        name: 'common',
                        message: "Пожалуйста, укажите id заказа."
                    }]
                })

                if (!session) return res.status(403).json({
                    errors: [{
                        name: 'common',
                        message: "Пользователь не найден."
                    }]
                })

                // const user = await User.findById(session.userId).lean()

                const order = await Order.findOne({_id: id, user: session.userId})
                res.json({success: {payload: {order:order}}})
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        })
    })
)
