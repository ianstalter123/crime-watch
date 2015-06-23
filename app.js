var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require("cookie-session"),
    db = require("./models"),
    methodOverride = require("method-override"),
    favicon = require('serve-favicon'),
    morgan = require("morgan");



app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// app.use(favicon(__dirname + '/public'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
loginMiddleware = require("./middleware/loginHelper");
routeMiddleware = require("./middleware/routeHelper");
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell',
  name: "chocolate chip"
}));

app.use(loginMiddleware);

app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('layout');
});

app.get('/search', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('search');
});



app.get('/signup', routeMiddleware.preventLoginSignup ,function(req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/crimes");
    } else {
      console.log(err);
      // TODO - handle errors in ejs!
      res.render("users/signup");
    }
  });
});


app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/crimes");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});

app.get('/crimes', function(req,res){
  db.Crime.find({}, function(err,crimes){
     res.format({
       'text/html': function(){
         res.render("crimes/index", {crimes: crimes});
       },

       'application/json': function(){
         res.send({ crimes: crimes });
       },

       'default': function(){
         res.status(406).send('Not Acceptable');
       }
     })
  });
});

app.post('/crimes', function(req,res){
  var crime = new db.Crime(req.body.crime);
  console.log(crime);
  crime.save(function(err,crime) {
    res.redirect("/crimes");
  });
});

app.get('/crimes/new', function(req,res){
  res.render("crimes/new");
});

app.get('/crimes/:id/', function(req,res){
  db.Crime.findById(req.params.id, function(err,crime){
    res.render("crimes/show", {crime:crime});
  });
});

app.get('/crimes/:id/edit', function(req,res){
  db.Crime.findById(req.params.id, function(err,crime){
    res.render("crimes/edit", {crime:crime});
  });
});

app.put('/crimes/:id', function(req,res){
  db.Crime.findByIdAndUpdate(req.params.id, req.body.crime, function(err,crime){
    res.redirect('/crimes');
  });
});

app.delete('/crimes/:id', function(req,res){
  db.Crime.findByIdAndRemove(req.params.id, function(err,crime){
    res.redirect('/crimes');
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req,res){
  res.render('errors/404');
});


app.listen(9090, function(){
  console.log("Welcome to the machine");
});