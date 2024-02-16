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


//no de Vanúbia a porta roda no 27018
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


Handlebars.registerHelper('capitalize', function (kay, options) {
    // Substitui todas as ocorrências de "-" por espaços em branco
    kay = kay.replace(/-/g, " ");
    return kay.charAt(0).toUpperCase() + kay.slice(1);
});

Handlebars.registerHelper('sentimentTag', function (key, options) {
    if (key === "Positivas") {
        return new Handlebars.SafeString('<small class="bi bi-emoji-heart-eyes "> Positivas </small>');
    } else if (key === "Negativas") {
        return new Handlebars.SafeString('<small class="bi bi-emoji-tear " > Negativas </small>');
    } else if (key === "Neutras") {
        return new Handlebars.SafeString('<small class="bi bi-emoji-neutral  "> Neutras </small>');
    } else {
        return '';
    }
});


Handlebars.registerHelper('verificTags', function(tags, options) {
    if (Array.isArray(tags) && tags.length === 0) {
        return new Handlebars.SafeString('Sem tags...');
    } else {
        var capitalizedTags = tags.map(function(tag) {
            return tag.charAt(0).toUpperCase() + tag.slice(1);
        });
        return new Handlebars.SafeString(capitalizedTags.join(', ')); 
    }
});

Handlebars.registerHelper('verificWords', function(words, options) {
    if (typeof words === 'string') {
        var wordArray = words.split(',');
        var capitalizedWords = wordArray.map(function(word) {
            return word.trim().charAt(0).toUpperCase() + word.trim().slice(1);
        });
        return new Handlebars.SafeString(capitalizedWords.join(', '));
    } else if (Array.isArray(words)) {
        var capitalizedWords = words.map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return new Handlebars.SafeString(capitalizedWords.join(', '));
    } else {
        return new Handlebars.SafeString('Sem palavras');
    }
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