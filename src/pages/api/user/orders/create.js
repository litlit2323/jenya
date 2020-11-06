import withDb from "@utils/dbConnect"
import apiRoutesHandler from "@utils/apiRoutesHandler"
import Order from './../../../../models/Order'
import OrderStatus from "../../../../models/OrderStatus"
import User from "./../../../../models/User"
import {sendNewAccountPasswordToUser} from "@utils/mailer"

import generatePassword from "password-generator"

import dbErrorCompile from "@utils/dbErrorCompile"
import validateData from "@validation/validator"
import {orderSchemaValidation} from "@validation/schemes"
import withSession from "@utils/withSession"

import config from "@root/config"


export default apiRoutesHandler(
    withDb({
        POST: withSession(async (req, res, session) => {
            try {
                // const potentialErrors = validateData(req.body, orderSchemaValidation.orderCreate)
                // if(potentialErrors.length !== 0) return res.status(422).json({errors:potentialErrors})
                const session = req.session.get("authToken")
                if (session) {
                    const user = await User.findById(session.userId)
                    console.log(user)
                    if (user) {
                        const defaultStatus = await OrderStatus.findOne(config.orderStatuses.notAccepted).lean()
                        const newOrder = await Order.create({...req.body, user: user.id, status: defaultStatus._id})
                        await newOrder.save()

                        await user.orders.addToSet(newOrder.id)
                        await user.save((err) => {
                            if (err) {
                                return dbErrorCompile(err, res)
                            }
                        })
                        res.status(200).json({success: {name: "common", message: "Заказ успешно оформлен."}})
                    } else {
                        return res.status(403).json({
                            errors: [{
                                name: 'common',
                                message: "Пользователь не найден."
                            }]
                        })
                    }
                } else {
                    const requestUserData = req.body.user
                    const newPassword = generatePassword(15, false)

                    const newUser = await User.create({...requestUserData, password: newPassword})
                    await newUser.save(async function (err) {
                        if (err) {
                            return dbErrorCompile(err, res)
                        }

                        await sendNewAccountPasswordToUser(requestUserData.email, newPassword)

                        const defaultStatus = await OrderStatus.findOne(config.orderStatuses.notAccepted).lean()
                        const newOrder = await Order.create({...req.body, user: newUser.id, status: defaultStatus._id})
                        await newOrder.save()

                        newUser.orders.addToSet(newOrder.id)
                        await newUser.save((err) => {
                            if (err) {
                                return dbErrorCompile(err, res)
                            }
                        })

                        res.status(200).json({success: {name: 'common', message: 'Ваш заказ успешно оформлен.'}})
                    })

                }
            } catch (e) {
                res.status(500).json({
                    errors: [{
                        name: 'common',
                        message: e.message
                    }]
                })
            }
        })
    })
)
