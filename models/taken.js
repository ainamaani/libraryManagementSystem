const mongoose = require('mongoose')
const Schema = mongoose.Schema

const takenBooksSchema = new Schema({
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


const TakenBooks = mongoose.model('BorrowedBook',takenBooksSchema)
module.exports = TakenBooks