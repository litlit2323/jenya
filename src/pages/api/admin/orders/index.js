import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import Order from './../../../../models/Order'
import callbackHandlerApi from "@utils/callbackHandlerApi"
import {checkAuthentication, checkAdminPermission} from "@utils/callbackHandlerApiFunctions"
import validateData, {isNubmer, isPresentInObject} from "@validation/validator";


export default apiRoutesHandler(
    withDb({
            GET: callbackHandlerApi([checkAuthentication, checkAdminPermission], async (req, res) => {
                try {

                    const validationSchema = {
                        pageNumber: {
                            callback: [isPresentInObject, isNubmer],
                            errorMessage: ["Укажите номер страницы в параметрах запроса.", "Номер страницы должен быть целочисленным значением."]
                        },
                        pagination: {
                            callback: [isPresentInObject, isNubmer],
                            errorMessage: ["Укажите кол-во записей на одну страницу в параметрах запроса.", "Кол-во записей на одну страницу должно быть быть целочисленным значением."]
                        }
                    }

                    const potentialErrors = validateData(req.query, validationSchema)
                    if (potentialErrors.length !== 0) return res.status(422).json({errors: potentialErrors})


                    const pageNumber = parseInt(req.query.pageNumber)
                    const pagination = parseInt(req.query.pagination)

                    if(!req.query.search){
                        const orders = await Order.find().skip((pageNumber - 1) * pagination).limit(pagination).sort({createdAt: 'desc'}).populate("status").populate("user").lean()
                        const totalSize = await Order.countDocuments()

                        return res.json({success: {name: "common", payload: {orders:orders, totalSize:totalSize}}})
                    }

                    const orders = await Order.find({$text: {$search: req.query.search}}).skip((pageNumber - 1) * pagination).limit(pagination).sort({createdAt: 'desc'}).populate("user").lean()
                    const totalSize = orders.length


                    res.json({success: {name: "common", payload:  {orders:orders, totalSize:totalSize}}})
                } catch (e) {
                    res.status(500).json({errors: [{name: 'common', message: e.message}]})
                }
            })
        }
    )
)

