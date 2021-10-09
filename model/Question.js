const mongoose = require('mongoose')
const {Schema} = mongoose;

const questionSchema = new Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"

    },
    question : {
        type : String,
        required : true
    },
    options : {
        type : [String],
        required : true
    },
    answer:{
        type : String,
        required : true
    },
    tag:{
        type : String,
        default : "general"
    },
    difficulty : {
        type : String,
        default : "low"
    }
})

module.exports = mongoose.Mongoose.model('questions', questionSchema)