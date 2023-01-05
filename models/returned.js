const mongoose = require('mongoose')
const Schema = mongoose.Schema

const returnedBooksSchema = new Schema({
    bookTitle: {
        type : String,
        required : true
    },
    returnTime: {
        type : String,
        required : true
    }, 
    returnDate: {
        type : Date,
        required: true
    },
    user:{
        type : String,
        required : true
    }
},{timestamps:true})


const ReturnedBook = mongoose.model('ReturnedBook',returnedBooksSchema)
module.exports = ReturnedBook