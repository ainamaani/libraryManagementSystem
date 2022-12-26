const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const jwt = require('jsonwebtoken')
const json = require('json')
const Student = require('./models/student');
const Book = require('./models/book');
const TakenBook = require('./models/taken');
const BorrowedBook = require('./models/bookedBooks');
const ReturnedBook = require('./models/returned');
const { db } = require('./models/student');
const { restart } = require('nodemon');
const passport = require('passport');
const app = express();
const { ensureAuthenticated } = require('./auth')

require('./passport-config')(passport)

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

//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('staticfiles'))
app.use(expressLayouts);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global variables
app.use((req,res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

//register view engine
app.set('view engine','ejs')
//set views location
app.set('views','pages')



app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/home',ensureAuthenticated,(req,res)=>{
    Book.find().distinct("college")
        .then((result)=>{
            res.render('homepage',{colleges : result, name: req.user.firstName})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.post('/register', (req,res)=>{
    const { firstName, lastName, regNumber, stdNumber,  
        email, gender, college, course, password, password2 } = req.body;

    let errors = [];

    //Check required data
    if(!firstName || !lastName || !regNumber || !stdNumber || !email || !gender ||
        !college || !course || !password || !password2 ){
            errors.push({ msg: 'Please fill in all fields' })
    }

    //Check passwords match
    if(password !== password2){
        errors.push({ msg: 'Passwords do not match' })
    }

    //Check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password should be atleast 6 characters' })
    }

    if(errors.length > 0){
        res.render('register',{
            errors,firstName,lastName,regNumber,stdNumber,
            email,gender,college,course,password,password2
        })
    }else{
        //Validation passed
        Student.findOne({ email: email })
            .then((user)=>{
                if(user){
                    //User exits
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register',{
                        errors,firstName,lastName,regNumber,stdNumber,
                        email,gender,college,course,password,password2
                    })    
                }else{
                    const newUser = new Student({
                        firstName,lastName,regNumber,stdNumber,
                        email,gender,college,course,password
                    })

                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(newUser.password,salt, (err, hash)=>{
                            if(err) throw err
                            //Save password to hash
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then((user)=>{
                                    req.flash('success_msg','You are now registered and can log in')
                                    res.redirect('/login')
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                        })
                    })
                }
            })
    }
})

app.post('/login',(req,res,next) =>{
    passport.authenticate('local',{
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

app.get('/logout',(req, res) =>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success_msg','You are logged out');
        res.redirect('/login');
    });
    
});

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

let today = Date.now()
// let today_date = today.toLocaleDateString()
// let today_time = today.toLocaleTimeString()


app.get('/book/:id',(req,res)=>{
    const id = req.params.id
    Book.findById(id)
        .then((result)=>{
            const bookedBook = new BorrowedBook({
                bookTitle : result.bookTitle,
                bookDate : today,
   
            })
            bookedBook.save()
            .then((result)=>{
                res.json({redirect: '/bookedbooks'})
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

app.get('/bookedbookpicked/:id',(req,res)=>{
    const id = req.params.id
    BorrowedBook.findByIdAndDelete(id)
        .then((result)=>{
            const pickedBook = new TakenBook({
                bookTitle : result.bookTitle,
                bookDate : today

            })
            pickedBook.save()
            .then((result)=>{
                res.json({ redirect: '/bookedbooks' })
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/takenbooks',(req,res)=>{
    TakenBook.find()
        .then((result)=>{
            res.render('takenBooks',{takenBooks : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get('/takenbook/:id',(req,res)=>{
    const id = req.params.id
    TakenBook.findById(id)
        .then((result)=>{
            res.render('takenBook',{ takenBook : result})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.delete('/takenbookreturned/:id',(req,res)=>{
    const id = req.params.id
    TakenBook.findByIdAndDelete(id)
        .then((result)=>{
            res.json({ redirect: '/home' })
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


    


//DELETE BOOKS AFTER A CERTAIN TIME
const date = new Date()
const currentDate = date.toLocaleDateString()

function bookingExpiry(){
    BorrowedBook.find()
        .then((result)=>{
            if(currentDate - result.bookDate > 5){
                BorrowedBook.findByIdAndDelete(result._id)
                    .then((result)=>{
                        console.log("Deleted")
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
}

setInterval(bookingExpiry,1000)

