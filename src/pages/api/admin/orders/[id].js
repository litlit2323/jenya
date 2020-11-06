import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication, checkAdminPermission} from "@utils/callbackHandlerApiFunctions"
import Order from './../../../../models/Order'

import validateData, {isEmail, isNubmer, isPhoneNubmer} from "@validation/validator"
import {orderSchemaValidation} from "@validation/schemes";


export default apiRoutesHandler(
    withDb({
        GET: callbackHandlerApi([checkAuthentication, checkAdminPermission], async (req, res) => {
            try {
                const {query: {id}} = req
                if (!id) return res.status(403).json({
                    errors: [{
                        name: 'common',
                        message: "Пожалуйста, укажите id заказа."
                    }]
                })

                const order = await Order.findOne({_id: id}).populate({
                    path: "user",
                    select: "-permissions -tokens -orders"
                })
                    .populate("status").lean()
                res.json({success: {name: "common", payload: {order: order}}})
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        }),
        PUT: callbackHandlerApi([checkAuthentication, checkAdminPermission], async (req, res) => {
            try {
                const data = req.body
                const potentialValidationErrors = validateData(data, orderSchemaValidation.orderPut)
                if(potentialValidationErrors.length !== 0) return res.status(422).json({errors:potentialValidationErrors})


                const order = await Order.findByIdAndUpdate(req.query.id, data, {new:true}).populate("user status").lean()
                res.json({success: {name: 'common', payload: {order: order}, message:"Данные успешно изменены."}})
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        }),
        DELETE: callbackHandlerApi([checkAuthentication, checkAdminPermission], async (req, res) => {
            try {
                const {query: {id}} = req
                const deletedOrder = await Order.deleteOne({_id: id})
                if (!deletedOrder) {
                    res.status(400).json({errors: [{name: "common", message: "Заказ не существует."}]})
                }
                res.json({success: {name: 'common', payload: deletedOrder}})
            } catch (e) {
                res.status(500).json({errors: [{name: 'common', message: e.message}]})
            }
        }),
    })
)
