var express = require("express"),
    profile = require("../models/profile"),
    middleware = require("../middleware")
    route = express.Router();


route.get("/campgrounds/profile/:profileid", middleware.isLoggedIn, function(req,res) {
    profile.findOne({"user.id": req.params.profileid}, function(err,found){
        if(err) {
            console.log(err)
        } else {
            
            res.render("profilePage/profile", {data:found})

        }
    })
})



module.exports = route