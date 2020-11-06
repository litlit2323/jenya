import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'
import Order from './../../models/Order'
import User from './../../models/User'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const testData = await User.findById(
        '5fa50faf6bff5600088fa9e7'
      ).populate('orders', ['status'])
      return res.json({ testData })
    },
  })
)
