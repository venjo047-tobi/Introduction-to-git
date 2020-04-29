var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    methodOvrd            = require("method-override"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    camping               = require("./models/camping"),
    comment               = require("./models/comment"),
    User                  = require("./models/user"),
    profile               = require("./models/profile"),
    seedDb                = require("./seeds");

var dotenv = require("dotenv").config();
   
var commentR = require("./routes/commentRoutes"),
    campGR   = require("./routes/campgroundRoutes"),
    indexR   = require("./routes/authentication"),
    profR    = require("./routes/profileRoutes");
    
var port = process.env.PORT || 8080;

// seedDb();
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://dbVenj:*110522*@cluster0-0ngzl.mongodb.net/test?retryWrites=true&w=majority", 
{useNewUrlParser:true}).then(function() {
    console.log("Db connected online")
}).catch(function(err){
    console.log("error:", err.message)
})

app.set("view engine" , "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOvrd("_method"))
app.use(flash())



app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res, next) {
    res.locals.currentUser = req.user
    
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next()
})


app.use("/campgrounds/:id",commentR);
app.use("/campgrounds",campGR);
app.use(indexR);
app.use(profR);



app.listen(port,function() {
    console.log("YelpcampV5 Refactor Server is OK")
})