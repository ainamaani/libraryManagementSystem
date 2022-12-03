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
    returnDate: {
        type : Date,
        required: false
    },
    user:{
        type : String,
        required : false
    }
},{timestamps:true})


const TakenBook = mongoose.model('TakenBook',takenBooksSchema)
module.exports = TakenBook