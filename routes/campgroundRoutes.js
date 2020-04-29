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
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
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
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            console.log(err)
            res.redirect("back")
        } 
        req.body.campground.image = result.secure_url
        camping.create(req.body.campground,function(err,camp) {
            if(err) {
                console.log("error")
            } else {
                camp.imageId = result.public_id
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
    res.render("/campgrounds/CampGroundsNew")
})

// SHOW ROUTE
route.get("/:id", function(req,res) {
    camping.findById(req.params.id).populate("comment").exec(function(err, foundCampgrounds) {
        if(err){
            console.log("error")
        } else {
            var locationUrl1 = "https://maps.google.com/maps?q=",
                locationUrl2 = "&t=&z=13&ie=UTF8&iwloc=&output=embed";
                console.log(locationUrl1 + foundCampgrounds.location + locationUrl2)
            res.render("campgrounds/showInfo", {campground:foundCampgrounds,
                                                url1: locationUrl1,
                                                url2: locationUrl2})
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
route.put("/:id", upload.single("image"), function(req,res) {
   camping.findById(req.params.id, async function(err,found) {
       if(err){
           req.flash("error", "Cannot be Updated")
           console.log(err)
       } else {      
                if(err){
                    console.log(err)
                } else {
                    if (req.file) {
                        try {
                            await cloudinary.v2.uploader.destroy(found.imageId);
                            var result = await cloudinary.v2.uploader.upload(req.file.path);
                            found.imageId = result.public_id;
                            found.image = result.secure_url;
                        } catch(err) {
                            req.flash("error", err.message);
                            return res.redirect("back");
                        }
                    }
                      found.name = req.body.name;
                      found.description = req.body.description;
                      found.location = req.body.location;

                      found.save();
                      req.flash("success","Successfully Updated!");
                      res.redirect("/campgrounds/" + found._id);
            }
                
            
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