const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema(
  {
    title: String,
    test2: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestModel2',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.models.TestModel || mongoose.model('TestModel', TestSchema)
