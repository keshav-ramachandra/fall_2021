const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubSchema = new Schema(
    {
        user: { type: String, required: true },
        topic:{ type: String, required: true },
    },
    { timestamps: true },
)

module.exports = Sub = mongoose.model('subs', SubSchema)