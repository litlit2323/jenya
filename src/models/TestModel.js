const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema(
  {
    title: String,
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.models.TestModel || mongoose.model('TestModel', TestSchema)
