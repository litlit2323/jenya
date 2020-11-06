import { compare } from 'bcrypt'

import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import TestModel from './../../models/TestModel'

import { secret } from '@utils/secret'
import cookie from 'cookie'
import dbErrorCompile from '@utils/dbErrorCompile'
import { v4 as uuidv4 } from 'uuid'
import withSession from '@utils/withSession'

export default apiRoutesHandler(
  withDb({
    GET: async (req, res) => {
      const testData = new TestModel({
        title: 'Test title aaa',
      })
      testData.save()
      return res.json({ testData })
    },
  })
)
