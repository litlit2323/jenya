const mongoose = require('mongoose');

const AccessHashSchema = new mongoose.Schema({
        hash: {
            type: String,
            required: [true, "Необходим хеш."],
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "У хеша должен быть id пользователя."],
        },
    },
    {
        timestamps: true
    })

// const AccessHash = mongoose.models.AccessHash || mongoose.model('AccessHash', AccessHashSchema, "AccessHash")
// const AccessHash = mongoose.model('AccessHash', AccessHashSchema, "AccessHash")
// let AccessHash
// try {
//     AccessHash = mongoose.model("AccessHash")
// } catch {
//     AccessHash = mongoose.model("AccessHash", AccessHashSchema, "AccessHash");
// }

module.exports = mongoose.models.AccessHash || mongoose.model('AccessHash', AccessHashSchema)

