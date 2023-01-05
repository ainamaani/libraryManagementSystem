const mongoose = require('mongoose')
const Schema = mongoose.Schema

const takenBooksSchema = new Schema({
    bookTitle: {
        type : String,
        required : false
    },
    takeTime: {
        type : String,
        required : false
    }, 
    takeDate: {
        type : Date,
        required: false
    },
    pickupDate: {
        type : String,
        required: false
    },
    user:{
        type : String,
        required : false
    },
    fine:{
        type : Number,
        default : 0
    }
},{timestamps:true})


const TakenBook = mongoose.model('TakenBook',takenBooksSchema)
module.exports = TakenBook