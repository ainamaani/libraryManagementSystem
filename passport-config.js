const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Student = require('./models/student')
const passport = require('passport-local')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email' },(email,password,done)=>{
            Student.findOne({ email: email})
                .then((user)=>{
                    if(!user){
                        return done(null, false, {message: 'That email is not registered'})
                    }

                    bcrypt.compare(password, user.password, (err, isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user)
                        }else{
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })
        })
    )

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done){
        Student.findById(id, function(err, user){
            done(err, user)
        })
    })
}