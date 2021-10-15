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
        required : true,
        minlength : 4,
        maxlength : 4
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
    },
    author : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('questions', questionSchema)