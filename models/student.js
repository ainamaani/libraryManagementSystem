const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    firstName: {
        type : String,
    },
    lastName: {
        type : String,
    },
    regNumber: {
        type : String,
    },
    stdNumber: {
        type : Number,
    },
    email : {
        type : String,
    },
    gender: {
        type : String,
    },
    college: {
        type : String,
    },
    course: {
        type : String,
    },
    password: {
        type : String,
    }

},{timestamps:true})

//creating model
const Student = mongoose.model('Student',studentSchema);
//export the Student model
module.exports = Student