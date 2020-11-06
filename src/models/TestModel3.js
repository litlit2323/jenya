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
  mongoose.models.TestModel3 || mongoose.model('TestModel3', TestSchema)
