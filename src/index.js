const express = require('express');
const morgan  = require('morgan');
const exphbs  = require('express-handlebars');
const path    = require('path');
const flash   = require('connect-flash');
const session = require('express-session'); //la sesiones guardos los datos en la memoria del servidor. (Tambien en la base de datos se tienen que almacenar).
const MySqlStore = require('express-mysql-session'); //para almacenar la session en la base de datos
const passport = require('passport');

const { database } = require('./keys');
//initializations-- Inicializando
const app = express();
require('./lib/passport');

//Settings---Configuracion del Servidor
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayaout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares-- Funciones que se envian cuando un usuario envia una peticion
app.use(session({
secret:'dariojrmysqlnodesession',
resave: false,
saveUninitialized: false,
store: new MySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize()); //inicializar passport
app.use(passport.session());


//Global Variables--Son variables para almacenar la aplicacion y se pueden usar en toda la aplicacion
app.use((req, res, next) =>{
app.locals.success = req.flash('success')//tomamos las variables globales creamos y la agraremos a nuestras vista locales.
app.locals.message = req.flash('message')
app.locals.user = req.user;
    next();    


});


// Routes-- Se definen la URL del servidor
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));


// Public- Carpetar para almecanr el codigo
app.use(express.static(path.join(__dirname, 'public')));



//Starting the server-- Iniciando el Servidor
app.listen(app.get('port'),() => {
console.log('Server on port', app.get('port'));    
});