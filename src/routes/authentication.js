const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');// estructurin para auth.js

router.get('/signup', isNotLoggedIn, (req, res) =>{
res.render('auth/signup');
});// creando enrutador para renderizar

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
 successRedirect: '/profile',
 failureRedirect: '/signup',
 failureFlas: true   
// el metodo authenticate toma el nombre de la autenticacion creada para que password sepa lo que tenga que hacer
})) //creando el enrutador para enviar por metodo Post y consumir APIREST


//Consumiendo APIREST Get
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
  // res.send('this is your Profile') validacion de la routes profile
});

//terminar con la sección del usuario
router.get('/logout', isLoggedIn, (req, res) => {
req.logOut();
res.redirect('/signin');
});

module.exports = router;