const passport = require('passport'); // passport te permite realizar la autenticacion con redes sociales pero la voy a realizar local en la base de datos 
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField:  'username',
    passwordField:   'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
  
const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
if (rows.length > 0){
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password);
if(validPassword){
    done(null, user, req.flash('success','Welcome ' + user.username));
} else {
    done(null, false, req.flash('message','Incorrect Password'));
} 
} else {
    return done(null, false, req.flash('message','The Username does not exists'));
}
  //comprabar datos
  //  console.log(req.body)
  //  console.log(username)
  //  console.log(password)  
}));

passport.use('local.signup', new LocalStrategy({
usernameField: 'username',
passwordField:  'password',
passReqToCallback: true
}, async (req, username, password, done) =>{
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
newUser.password = await helpers.encryptPassword(password);
const result = await pool.query('INSERT INTO users SET ?', [newUser]);
newUser.id = result.insertId;
return done(null, newUser);

//console.log(result); mensaje por consola
    //console.log(req.body); paara comprabar que se envien los datos.
}));

//Como password esta trabajando internamente hay que desarializarlo y sericiarlo
passport.serializeUser((user, done) => {
done(null, user.id);
});

//deserializarlo con callbacks
passport.deserializeUser(async (id, done) => {
const rows = await pool.query('SELECT * FROM users Where id = ?', [id]);
done(null, rows[0]);
});