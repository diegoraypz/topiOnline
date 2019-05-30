const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports= function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    //signup
    passport.use('local-signup', new LocalStrategy({
        /*usernamitoField: 'name',
        userlatsnameField: 'lastname',*/
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    function(req,/* name, lastname,*/ email, password, done){
        User.findOne({'local.email':email}, function(err, user){
            if(err){return done(err);}
            if (user){
                return done(null, false, req.flash('signupMessage', 'El email ya existe.'));
            }else{
                var newUser= new User();
                /*newUser.local.name= name;
                newUser.local.lastname= lastname;*/
                newUser.local.email= email;
                newUser.local.password= newUser.generateHash(password);
                newUser.save(function(err){
                    if(err){throw err;}
                    return done(null, newUser);
                });
            }
        })
    }));

    //login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    function(req, email, password, done){
        User.findOne({'local.email':email}, function(err, user){
            if(err){return done(err);}
            if (!user){
                return done(null, false, req.flash('loginMessage', 'El usuario no ha sido encontrado.'));
            }
            if(!user.validatePassword(password)){
                return done(null, false, req.flash('loginMessage','Contraseña incorrecta.'));
            }
            return done(null, user);
        })
    }));
}