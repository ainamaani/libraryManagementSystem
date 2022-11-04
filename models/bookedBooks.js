const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookedBooksSchema = new Schema({
    bookTitle: {
        type : String,
        required : true
    },
    bookTime: {
        type : String,
        required : true
    }, 
    bookDate: {
        type : Date,
        required: true
    },
    user:{
        type : String,
        required : true
    }
},{timestamps:true})


const BorrowedBook = mongoose.model('BorrowedBook',bookedBooksSchema)
module.exports = BorrowedBook