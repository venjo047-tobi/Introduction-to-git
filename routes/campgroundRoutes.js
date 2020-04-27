var express = require("express"),
    multer = require("multer"),
    camping = require("../models/camping"),
    route = express.Router(),
    User  = require("../models/user"),
    comment = require("../models/comment"),
    profile = require("../models/profile")
    Middleware = require("../middleware"),

    storage = multer.diskStorage({
        filename: function(req,file,callback){
            callback(null, Date.now() + file.originalname)
        }
    });

var imageFilter = function(req,file,cb) {
    if(!file.originalname.match(/\.(jpg| jpeg| png| gif)$/i)) {
        return cb(new Error("Only image format is Allowed"),false);
    }
    cb(null,true)
}


var upload = multer(
    {   storage:storage,
        fileFilter: imageFilter
    });

var cloudinary = require("cloudinary");
    cloudinary.config({
        cloud_name: "dtk1smnrj",
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    })

// INDEX ROUTE 
route.get("/", function(req,res) {
    camping.find({},function(err,camp){
        if(err) {
            console.log("error")
        } else {
            
            res.render("campgrounds/campgrounds", {camps:camp})
        }
    })
   
})
// CREATE ROUTE
route.post("/", Middleware.isLoggedIn, upload.single("image"), function(req,res) {
    var yeah = req.user
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.campground.image = result.secure_url

        camping.create(req.body.campground,function(err,camp) {
            if(err) {
                console.log("error")
            } else {
                camp.user.id = req.user._id;
                camp.user.username = req.user.username;
    
                camp.save()
                yeah.campgrounds.name = camp.name;
                yeah.campgrounds.image = camp.image;
                yeah.campgrounds.description = camp.description;
                yeah.save()
                profile.findOneAndUpdate({"user.id": req.user._id}, {$push: {camping: camp}}, function(err, OK){
                    if(err) {
                        console.log(err)
                    } else {
                        
                        res.redirect("/campgrounds")
                    }
                });
                };
    
    
            }
        )
        
    })
    
 
    
})
// NEW ROUTE
route.get("/new", Middleware.isLoggedIn, function(req,res) {
    res.render("campgrounds/CampGroundsNew")
})

// SHOW ROUTE
route.get("/:id", function(req,res) {
    camping.findById(req.params.id).populate("comment").exec(function(err, foundCampgrounds) {
        if(err){
            console.log("error")
        } else {
            res.render("campgrounds/showInfo", {campground:foundCampgrounds})
        }
    })
   
})

// EDIT ROUTE
route.get("/:id/edit", function(req,res) {
    if(req.isAuthenticated()){
        camping.findById(req.params.id, function(err,foundId) {
            if(err) {
                res.redirect("/campgrounds/" + req.params.id)
            } else {


                if(foundId.user.id.equals(req.user._id)) {
                    res.render("campgrounds/editInfo", {data:foundId})

                } else {

                    res.redirect("/campgrounds/" + req.params.id)
                }
            }
        }) 
    } else {
        res.redirect("/campgrounds/" + req.params.id)
    }

    
})

// UPDATE
route.put("/:id", Middleware.checkOwnership, function(req,res) {
    camping.findByIdAndUpdate(req.params.id, req.body.camps, function(err,updated) {
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// DELETE
route.delete("/:id",Middleware.isLoggedIn, function(req,res) {   
    camping.findByIdAndDelete(req.params.id, function(err,deleted) {
        if(err){
            console.log(err)
        } else {

            profile.findOne({"user._id": req.user_id}, function(err,found) {
                if(err) {
                    console.log(err)
                } else {

                    profile.updateOne( 
                        {"_id": found._id },
                        { $pull: { camping : { _id : req.params.id } } },
                        
                        function removeConnectionsCB(err, obj) {
                            if(err) {
                                console.log(err)
                            } else {
                                res.redirect("/campgrounds")
                            }
                        });
                        
                    
                }
            })
        }
    })
})




module.exports = route