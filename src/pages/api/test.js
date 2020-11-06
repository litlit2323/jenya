import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const testData = new TestModel({
        title: 'Test title aaa',
      })
      await testData.save()
      return res.json({ testData })
    },
  })
)
