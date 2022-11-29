const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Student = require('./models/student');
const Book = require('./models/book');
const TakenBook = require('./models/taken');
const BorrowedBook = require('./models/bookedBooks');
const ReturnedBook = require('./models/returned');
const { db } = require('./models/student');
const { restart } = require('nodemon');
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

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/home',(req,res)=>{
    Book.find().distinct("college")
        .then((result)=>{
            res.render('homepage',{colleges : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/register',async (req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const student = new Student({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        regNumber : req.body.regNumber,
        stdNumber : req.body.stdNumber,
        email : req.body.email,
        gender : req.body.gender,
        college : req.body.college,
        course : req.body.course,
        password : hashedPassword,
     
        
    })
    student.save()
        .then((result)=>{
            res.redirect('/home')
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    Student.findOne({$or: [{email:username},{stdNumber:username}]})
    .then((student)=>{
        if(student){
            bcrypt.compare(password, student.password, function(err,result){
                if(err){
                    res.redirect('404')
                }
                if(result){
                    let token = jwt.sign({name: student.stdNumber},'verySecretValue',{expiresIn: '1h'})
                    res.redirect('homepage')
                }else{
                    console.log('Failed')
                }
            })
        }
        else{
            res.redirect('register')
        }
    })
    .catch((error)=>{
        console.log(error)
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


app.get('/colleges/:college',(req,res)=>{
    const college = req.params.college
    Book.find({college})
        .then((result)=>{
            res.render('college',{collegebooks: result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/books/:id',(req,res)=>{
    const id = req.params.id;
    Book.findById(id)
        .then((result)=>{
            res.render('book',{book : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/book/:id',(req,res)=>{
    const id = req.params.id
    Book.findById(id)
        .then((result)=>{
            const bookedBook = new BorrowedBook({
                bookTitle : result.bookTitle,     
            })
            bookedBook.save()
            .then((result)=>{
                console.log("Successful")
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
})
    
app.get('/bookedbooks',(req,res)=>{
    BorrowedBook.find()
        .then((result)=>{
            res.render('bookedBooks',{bookedBooks : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/bookedbook/:id',(req,res)=>{
    const id = req.params.id;
    BorrowedBook.findById(id)
        .then((result)=>{
            res.render('bookedbook',{bookedBook:result})
        })
        .catch((err)=>{
            console.log(err)
        })
    
})

app.post('/collegebooks/:id',(res,req)=>{
    const id = req.params.id;
    console.log(id)
})

app.use((req,res)=>{
    res.status(404).render('404')
})


    
