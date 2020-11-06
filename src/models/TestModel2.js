const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema(
  {
    title: String,
    test3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestModel3',
    },
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.models.TestModel2 || mongoose.model('TestModel2', TestSchema)
