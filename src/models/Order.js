const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Пожалуйста сформулируйте тему заказа.'],
      index: true,
      max: [100, 'Пожалуйста, сформулируйте тему заказа короче.'],
    },
    description: {
      type: String,
      required: [true, 'Пожалуйста, сформулируйте описание вашего заказа.'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'У заказа должен быть заказчик.'],
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderStatus',
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

OrderSchema.index({ title: 'text', description: 'text' })

// const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, "Order")
// let Order
// try {
//     Order = mongoose.model("Order");
// } catch {
//     Order = mongoose.model("Order", OrderSchema, "Order");
// }

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema)
