import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'

import User from './../../../../models/User'
import callbackHandlerApi from '@utils/callbackHandlerApi'
import { checkAuthentication } from '@utils/callbackHandlerApiFunctions'

import { secret } from '@utils/secret'
import validateData, {
  isNubmer,
  isPresentInObject,
} from '@validation/validator'

export default apiRoutesHandler(
  withDb({
    GET: callbackHandlerApi([checkAuthentication], async (req, res) => {
      try {
        const validationSchema = {
          pageNumber: {
            callback: [isPresentInObject, isNubmer],
            errorMessage: [
              'Укажите номер страницы в параметрах запроса.',
              'Номер страницы должен быть целочисленным значением.',
            ],
          },
          pagination: {
            callback: [isPresentInObject, isNubmer],
            errorMessage: [
              'Укажите кол-во записей на одну страницу в параметрах запроса.',
              'Кол-во записей на одну страницу должно быть быть целочисленным значением.',
            ],
          },
        }

        const potentialErrors = validateData(req.query, validationSchema)
        if (potentialErrors.length !== 0)
          return res.status(422).json({ errors: potentialErrors })

        const userSession = req.session.get('authToken')
        if (!userSession) {
          return res.status(403).json({
            errors: [
              {
                name: 'common',
                message: 'Пользователя не найдено.',
              },
            ],
          })
        }

        const pageNumber = parseInt(req.query.pageNumber)
        const pagination = parseInt(req.query.pagination)

        const toSkip = (pageNumber - 1) * pagination

        const user = await User.findById(userSession.userId).populate({
          select: '_id title createdAt status price',
          options: {
            sort: { createdAt: -1 },
            skip: toSkip,
          },
          path: 'orders',
          model: Order,
          populate: {
            path: 'status',
            model: OrderStatus,
          },
        })

        const orders = user.orders
        const totalSize = user.orders.length

        res.json({
          success: { payload: { orders: orders, totalSize: totalSize } },
        })
      } catch (e) {
        res
          .status(500)
          .json({ errors: [{ name: 'common', message: e.message }] })
      }
    }),
  })
)
