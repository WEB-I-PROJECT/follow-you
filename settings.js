const express = require('express');
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const {marked} = require('marked');
const user = require('./routes/user');
const passport = require("passport")
require('./config/auth')(passport);

//session
app.use(session({
    secret: '96f3fe6c-d970-48fc-9ac0-4a4e42cdf99f',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
})

//database
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// 27017:  reajustar para os demais 
// vanúbia: mongosh --port 27018
mongoose.connect("mongodb://127.0.0.1:27018/hubnews").then(() =>{
    console.log("Banco de dados conectado!");
}).catch((error) =>{
    console.log("Erro ao conectar no banco de dados: " + error)
});

//template
const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'main'
});

// Configuração adicional para permitir o acesso ao protótipo
hbs._renderTemplate = function (template, context, options) {
    options.allowProtoMethodsByDefault = true;
    options.allowProtoPropertiesByDefault = true;
    return template(context, options);
};

//template helpers
Handlebars.registerHelper('markdown', function (options) {
    return new Handlebars.SafeString(marked(options.fn(this)));
  });
  
Handlebars.registerHelper('eq', function (a, b) {
       return a.equals(b) || a === b;
});

Handlebars.registerHelper('truncate', function (text, length, options) {
    if (text.length > length) {
        return new Handlebars.SafeString(text.substring(0, length) + "...");
    }
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('displayType', function (type, options) {
    if (type === 'by-category') {
        return new Handlebars.SafeString('<small class="text-type bi bi-ui-checks"> Por categoria</small>');
    } else if (type === 'by-keywords') {
        return new Handlebars.SafeString('<small class="text-type bi bi-card-heading"> Por palavras-chave</small>');
    }
    
    return new Handlebars.SafeString('<p>Tipo desconhecido</p>');
});

//engine template
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');

//static files
app.use(express.static(path.join(__dirname, "public")));

//forms parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = app;