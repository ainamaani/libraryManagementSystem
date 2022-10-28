const mongoose = require('mongoose')
const Schema = mongoose.Schema

bookSchema = new Schema({
    bookTitle : {
        type : String,
        required : true
    },
    edition : {
        type : Number,
        required : false
    },
    author : {
        type : String,
        required : true
    },
    copyNumber : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    college : {
        type : String,
        required : true
    },
    subjectArea : {
        type : String,
        required : true
    }
},{timestamps:true})


const Book = mongoose.model('Book',bookSchema)
module.exports = Book