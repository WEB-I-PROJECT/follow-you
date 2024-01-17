const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
//model user
require('../models/User');
const User = mongoose.model("users");


module.exports = function(passport)
{
    passport.use(new localStrategy({
        usernameField: 'email', 
        passwordField: 'password',
        passReqToCallback: true,
        
    },(req, email, password, done) => {

        User.findOne({email: email}).then((users)=> {
            if(!users){
                req.flash('error_msg', 'Essa conta não existe'); 
                return done(null, false);
            }
            bcrypt.compare(password, users.password, (erro, batem) => {

                if (batem) {
                    return done(null, users);
                } else {
                    req.flash('error_msg', 'Senha incorreta'); 
                    return done(null, false);
                }
            })
        })

    }))

    passport.serializeUser((users, done) => {
        done(null, users.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
    
}
