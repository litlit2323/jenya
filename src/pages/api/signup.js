import withDb from '@utils/dbConnect'
import apiRoutesHandler from '@utils/apiRoutesHandler'
import User from './../../models/User'

import { sendNewAccountPasswordToUser } from '@utils/mailer'
import dbErrorCompile from '@utils/dbErrorCompile'
import { userSchemaValidation } from '@validation/schemes'
import validateData from '@validation/validator'
import withSession from '@utils/withSession'

export default apiRoutesHandler(
  withDb({
    POST: withSession(async (req, res) => {
      try {
        if (req.session.get('authToken')) {
          return res.status(400).send({
            errors: [
              {
                name: 'common',
                message:
                  'Вы авторизованы, чтобы зарегистрировать новый аккаунт, выйдите из своего текущего.',
              },
            ],
          })
        }
        const data = req.body
        console.log(JSON.stringify(data, null, 4))
        const potentialErrors = validateData(data, userSchemaValidation.signup)
        if (potentialErrors.length !== 0)
          return res.status(422).json({ errors: potentialErrors })

        const newUser = await User.create(data)
        await newUser.save(function (err) {
          if (err) {
            return dbErrorCompile(err, res)
          }
          sendNewAccountPasswordToUser(data.email, data.password)
          res.json({
            success: {
              name: 'common',
              message: 'Вы успешно зарегистрированы.',
            },
          })
        })
      } catch (e) {
        res
          .status(500)
          .send({ errors: [{ name: 'common', message: e.message }] })
      }
    }),
  })
)
