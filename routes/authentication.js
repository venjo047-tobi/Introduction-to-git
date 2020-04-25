var express = require("express"),    
    User    = require("../models/user"),
    profile = require("../models/profile"),
    passport = require("passport"),
    middleware = require("../middleware"),
    route   = express.Router();


// AUTH ROUTES
route.get("/", function(req,res) {
    res.render("landing")
})

route.get("/register", function(req,res) {
    res.render("register");
})



route.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        if(err) {
            console.log(err);
            req.flash("error", err.message)
             res.redirect("/register");
        } else {
            profile.create({name: req.body.fullname}, function(err,saved){
                if(err){
                    req.flash("error", "Profile not saved")
                } else {
                   
                    saved.user.id = user._id;
                    saved.user.username = user.username;
                    saved.save()
                    passport.authenticate("local")(req,res, function(){
                        res.redirect("/campgrounds");
                        });
                }
            })
            
        }

        
        
    });
});
route.get("/login", function(req,res) {
    res.render("login")
})


route.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/register"
}), function(req,res) {
    
})



route.get("/logout", function(req,res) {
    req.logOut()
    req.flash("success", "Logout Succesfully")
    res.redirect("/campgrounds" )
})





module.exports = route