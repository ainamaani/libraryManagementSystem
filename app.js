const express = require('express');
const mongoose = require('mongoose')
const Student = require('./models/student')
const Book = require('./models/book')
const app = express();
//connection string to mongo db
const dbURI = 'mongodb+srv://library:elibrary@trial.nacabxh.mongodb.net/E-Library?retryWrites=true&w=majority';
//using mongoose to connect to mongo db
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result)=>{
        app.listen(3000)
    })
    .catch((err)=>{
        console.log(err)
    })
//register view engine
app.set('view engine','ejs')
//set views location
app.set('views','pages')

//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('staticfiles'))


app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/home',(req,res)=>{
    Book.find()
        .then((result)=>{
            res.render('homepage',{books : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/register',(req,res)=>{
    const student = new Student(req.body)
    student.save()
        .then((result)=>{
            res.redirect('/home')
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/admin',(req,res)=>{
    res.render('librarian')
})

app.post('/admin',(req,res)=>{
    const book = new Book(req.body)
    book.save()
        .then((result)=>{
            res.redirect('/home')
        })
        .catch((err)=>{
            console.log(err)
        })
})