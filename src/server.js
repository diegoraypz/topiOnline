const express = require('express');
const app = express();

const path = require('path'); //para manejar rutas
const mongoose = require('mongoose'); //para conectar a mongodb
const passport = require('passport'); //para configurar autenticación
const flash = require('connect-flash'); //para mensajes
const morgan = require('morgan'); //mostrar métodos http por consola
const cookieParser = require('cookie-parser'); //para administrar cookies
const bodyParser = require('body-parser'); //convertir el cuerpo de la info del navegador al servidor
const session = require('express-session');

const { url }= require('./config/database');
//Conectar base de datos
mongoose.connect(url,{
    useNewUrlParser: true
});
//Configurar passport
require('./config/passport')(passport);

//configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false})); //extended: false no se va a procesar imágenes, solo datos
app.use(session({
    secret: 'topionline',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //iniciar passport
app.use(passport.session()); //mantener las sesiones en el navegador y no estar consultando la bd en todo momento
app.use(flash());

//rutas
require('./app/routes')(app, passport); //por parámetros pasar la aplicación de express y passport para autenticación

//archivos estáticos
app.use(express.static(path.join(__dirname,'public')));

app.listen(app.get('port'), ()=>{
    console.log('servidor en puerto', app.get('port'));
});