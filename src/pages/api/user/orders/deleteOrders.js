
import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import Order from '../../../../models/Order'
import User from './../../../../models/User'
import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication} from "@utils/callbackHandlerApiFunctions"
import {secret} from "@utils/secret"
import validateData, {isPresentInObject} from "@validation/validator"
import mongoose from "mongoose"


export default apiRoutesHandler(
    withDb({
            POST: callbackHandlerApi([checkAuthentication], async (req, res, session) => {
                try {

                    //Приходит запрос с массивом айдишников на удаление записей
                    const validationSchema = {
                        recordsToDelete: {
                            callback: [isPresentInObject],
                            errorMessage: ["Вы должны указать массив из id записей, которые необходимо удалить."]

                        }
                    }

                    const potenitalErrors = validateData(req.body, validationSchema)
                    if (potenitalErrors.length !== 0) return res.status(422).json({errors: potenitalErrors})

                    let {recordsToDelete} = req.body
                    // recordsToDelete = recordsToDelete.map(recordToDelete => mongoose.Types.ObjectId(recordToDelete))


                    // const user = await User.findByIdAndUpdate(session.userId, {$set: {$pullAll: {orders: recordsToDelete}}} )//Находим пользователя и удаляем заказы из его массива заказов
                    //Находим пользователя и удаляем заказы из его массива заказов
                    const user = await User.findById(session.userId)
                    user.orders = user.orders.filter(order =>  {
                        if(!recordsToDelete.includes(order)) {
                            return order
                        }

                    })
                    await user.save()


                    //удаляем заказы
                    await Order.deleteMany({_id: {$in: recordsToDelete}, user: user._id})
                    res.status(200).json({success: {name: "common", message: "Заказы успешно удалены."}})
                } catch (e) {
                    res.status(500).json({errors: [{name: "common", message: e.message}]})
                }
            })
        }
    )
)

