import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import OrderStatus from './../../../../models/OrderStatus'
import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication, checkAdminPermission} from "@utils/callbackHandlerApiFunctions"


export default apiRoutesHandler(
    withDb({
            GET: callbackHandlerApi([checkAuthentication, checkAdminPermission], async (req, res) => {
                try {

                    const ordresStatuses = await OrderStatus.find().lean()

                    res.json({success: {name: "common", payload: {ordresStatuses: ordresStatuses}}})
                } catch (e) {
                    res.status(500).json({errors: [{name: 'common', message: e.message}]})
                }
            })
        }
    )
)

