var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    favicon = require('serve-favicon'),
    morgan = require("morgan");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req,res){
  res.render('layout');
});

app.get('*', function(req,res){
  res.render('errors/404');
});

app.listen(9090, function(){
  console.log("Welcome to the machine");
});