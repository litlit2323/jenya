const mongoose = require('mongoose')

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

//При импорте происходит инициализация схем в БД (тот самый try/catch)
const OrderStatus = require('./src/models/OrderStatus')
const Permission = require('./src/models/Permission')
const AccessHash = require('./src/models/AccessHash')
const Order = require('./src/models/Order')
const User = require('./src/models/User')

const config = require('./config')
const nextConfig = require('./next.config')

const createPermissions = async permissions => {
  console.log(
    '----------------Проверка наличия прав пользователей в БД.----------------'
  )
  for (let key in permissions) {
    const foundedPermission = await Permission.findOne(permissions[key])
    console.log('Было найдено право: ', foundedPermission)
    if (!foundedPermission) {
      const createdPermission = await Permission.create(permissions[key])
      await createdPermission.save()
      console.log('Было создано право: ', createdPermission)
    }
  }
  console.log(
    '----------------------------------------------------------------'
  )
}

const createOrderStatuses = async orderStatuses => {
  console.log(
    '----------------Проверка наличия статусов заказов в БД.----------------'
  )
  for (let key in orderStatuses) {
    // console.log(`Создаём правоs: ${orderStatuses[key].title}.`)
    const foundedOrderStatus = await OrderStatus.findOne(orderStatuses[key])
    console.log('Был найден статус: ', foundedOrderStatus)
    if (!foundedOrderStatus) {
      const createdOrderStatus = await OrderStatus.create(orderStatuses[key])
      await createdOrderStatus.save()
      console.log('Был создан статус заказа: ', createdOrderStatus)
    }
  }
  console.log(
    '----------------------------------------------------------------'
  )
}

async function main() {
  const dbConnection = await mongoose.connect(nextConfig.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

  await createPermissions(config.permissions)
  await createOrderStatuses(config.orderStatuses)
  mongoose.connection.close()
}
main()
