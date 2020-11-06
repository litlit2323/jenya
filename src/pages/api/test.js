import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'
import TestModel2 from './../../models/TestModel2'
import TestModel3 from './../../models/TestModel3'
import User from './../../models/User'
import Order from './../../models/Order'
import OrderStatus from './../../models/OrderStatus'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const test3 = new TestModel3({ title: 'test3 title' })
      await test3.save()
      const test2 = new TestModel2({ title: 'test2 title', test3: test3.id })
      await test2.save()
      const test22 = new TestModel2({ title: 'test22 title', test3: test3.id })
      await test22.save()
      // const test1 = new TestModel({ title: 'test1 title' })
      // test1.test2.addToSet(test2.id)
      // test1.test2.addToSet(test22.id)
      // await test1.save()

      // const testData = await TestModel.find().populate({
      //   path: 'test2',
      //   populate: { path: 'test3' },
      // })
      const id = '5fa50faf6bff5600088fa9e7'
      // const user = await User.findById(id)
      // // user.test2 = []

      // // test2.user = user.id
      // // await test2.save()

      // // user.test2.addToSet(test2.id)
      // // user.test2.addToSet(test22.id)
      // // await user.save()
      //
      //
      // { path: 'created_by', model: Order }
      // const testData = await User.find().populate('orders', Order)
      const testData = await User.find().populate({
        path: 'orders',
        model: Order,
        populate: {
          path: 'status',
          model: OrderStatus,
        },
      })
      return res.json({ testData })
    },
  })
)
