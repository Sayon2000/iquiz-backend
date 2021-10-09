const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
    name :{
        type : String,
        required: true
    },
    email : {
        type:String,
        required: true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    points : {
        type: Number,
        default:0
    },
    prevpoints :{
        type : [Number],
        default : []
    }
})

module.exports = mongoose.model('users', UserSchema);