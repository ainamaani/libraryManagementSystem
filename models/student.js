const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    firstName: {
        type : String,
        required : true
    },
    lastName: {
        type : String,
        required : true
    },
    regNumber: {
        type : String,
        required : true
    },
    stdNumber: {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    gender: {
        type : String,
        required : true
    },
    college: {
        type : String,
        required : true
    },
    course: {
        type : String,
        required : true
    },
    // password: {
    //     type : Mixed,
    //     required : true
    // }

},{timestamps:true})

//creating model
const Student = mongoose.model('Student',studentSchema);
//export the Student model
module.exports = Student