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

app.get('/',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Crime.find({}, function(err,crimes){
     res.format({
       'text/html': function(){
         res.render("layout", {crimes: crimes});
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
   db.Crime.findById(req.params.id).populate("comments").exec(function(err,crime){
    res.render("crimes/show", {crime:crime});
  })
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

////
/********* comments ROUTES *********/
//for shallow routes we can restructure by 
//removing the first (parent ID) sometimes

// INDEX
app.get('/crimes/:crime_id/comments', function(req,res){
  db.Crime.findById(req.params.crime_id).populate('comments').exec(function(err,crime){
    res.render("comments/index", {crime:crime});
  });
});

// NEW
app.get('/crimes/:crime_id/comments/new', function(req,res){
  db.Crime.findById(req.params.crime_id,
    function (err, crime) {
      res.render("comments/new", {crime:crime});
    });
});

// CREATE
app.post('/crimes/:crime_id/comments', function(req,res){
  db.Comment.create({name:req.body.comment}, function(err, comment){
    console.log(comment)
    if(err) {
      console.log(err);
      res.render("comments/new");
    }
    else {
      db.Crime.findById(req.params.crime_id,function(err,crime){
        crime.comments.push(comment);
        comment.crime = crime._id;
        comment.save();
        crime.save();
        res.redirect("/crimes/"+ req.params.crime_id +"/comments");
      });
    }
  });
});

// SHOW
app.get('/crimes/:crime_id/comments/:id', function(req,res){
  //can you remove part of the route?
  //can remove the first part becuz of parent/child relat
  db.Comment.findById(req.params.id)
    .populate('crime')
    .exec(function(err,comment){
      console.log(comment.crime)
      res.render("comments/show", {comment:comment});
    });
});

// EDIT
//can you remove part of the route?
app.get('/crimes/:crime_id/comments/:id/edit', function(req,res){
  db.Comment.findById(req.params.id)
    .populate('crime')
    .exec(function(err,comment){
      res.render("comments/edit", {comment:comment});
    });
});

// UPDATE
app.put('/crimes/:crime_id/comments/:id', function(req,res){
 db.Comment.findByIdAndUpdate(req.params.id, {name:req.body.name},
     function (err, comment) {
       if(err) {  
         res.render("comments/edit");
       }
       else {
         res.redirect("/crimes/" + req.params.crime_id + "/comments");
       }
     });
});

// DESTROY
app.delete('/crimes/:crime_id/comments/:id', function(req,res){
 db.Comment.findByIdAndRemove(req.params.id, {name:req.body.name},
      function (err, comment) {
        if(err) {
          console.log(err);
          res.render("comments/edit");
        }
        else {
          res.redirect("/crimes/" + req.params.crime_id + "/comments");
        }
      });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req,res){
  res.render('errors/404');
});


app.listen(process.env.PORT || 3000)
  console.log("Welcome to the machine");
});