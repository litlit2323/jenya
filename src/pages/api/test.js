import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'
import TestModel2 from './../../models/TestModel2'
import TestModel3 from './../../models/TestModel3'
import Order from './../../models/Order'
import User from './../../models/User'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const test3 = new TestModel3({ title: 'test3 title' })
      test3.save()
      const test2 = new TestModel2({ title: 'test2 title', test3: test3.id })
      test2.save()
      const test1 = new TestModel({ title: 'test1 title', test2: test2.id })
      test1.save()

      const testData = await TestModel.find().populate('test2', ['test3'])
      return res.json({ testData })
    },
  })
)
