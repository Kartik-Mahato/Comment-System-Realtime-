const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true }
},{timestamps:true})

const comment=mongoose.model('Comment',commentSchema)

module.exports=comment
