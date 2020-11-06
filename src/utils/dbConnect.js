import mongoose from 'mongoose'

const connection = {
  isConnected: 0,
}

const connectDb = async () => {
  if (connection.isConnected) {
    return
  }
  try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })

    connection.isConnected = !!dbConnection.connections[0].readyState
  } catch (err) {
    console.error(`error connecting to db ${err.message || err}`)
  }
}

function withDb(handler) {
  connectDb()
  return handler
}

export default withDb
