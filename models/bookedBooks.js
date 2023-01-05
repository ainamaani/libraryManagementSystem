const mongoose = require('mongoose')
const Schema = mongoose.Schema

let today = Date.now()
const bookedBooksSchema = new Schema({
    bookTitle: {
        type : String,
        required : true
    },
    bookTime: {
        type : String,
        required : false
    }, 
    bookDate: {
        type : String,
        required : false
    },
    user:{
        type : String,
        required : false
    }
},{timestamps:true})


const BorrowedBook = mongoose.model('BorrowedBook',bookedBooksSchema)
module.exports = BorrowedBook