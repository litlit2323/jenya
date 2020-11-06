import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'
import Order from './../../models/Order'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const testData = await Order.find()
      return res.json({ testData })
    },
  })
)
