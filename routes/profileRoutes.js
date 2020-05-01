var express = require("express"),
    profile = require("../models/profile"),
    camping = require("../models/camping"),
    middleware = require("../middleware"),
    multer = require("multer"),
    route = express.Router();

var storage = multer.diskStorage({
    filename: function(req,file,callback) {
        callback(null, Date.now() + file.originalname)
    }
})

var imageFilter = function(req,file,cb) {
    if(!file.originalname.match(/\.(jpg| jpeg| png| gif)$/i)) {
        return cb(new Error("Only image format is Allowed"),false);
    }
    cb(null,true)
}

var upload = multer({ storage: storage,
                      fileFilter: imageFilter});



var cloudinary = require("cloudinary");
    cloudinary.config({
         cloud_name: "dtk1smnrj",
         api_key: process.env.api_key,
         api_secret: process.env.api_secret
                      })

route.get("/campgrounds/profile/:profileid", middleware.isLoggedIn, function(req,res) {
    profile.findOne({"user.id": req.params.profileid}, function(err,found){
        if(err) {
            console.log(err)
        } else {
            res.render("profilePage/profile", {data:found})

        }
    })
})
route.get("/campgrounds/otherProf/:profId", function(req,res) {
    profile.findOne({"user.id":req.params.profId}, function(err,found) {
        if(err){
            console.log(err)
        } else {
            res.render("profilePage/otherProfile", {data:found})
        }
    })
})

route.get("/campgrounds/profile/:profileid/upload", middleware.isLoggedIn, function(req,res) {
    profile.findOne({"user.id": req.user._id}, function(err, found) {
        if(err) {
            console.log(found)
            res.redirect("back")
        } else {
            console.log(found)
            res.render("profilePage/uploadProfile", {data:found})

        }
    })
})



route.put("/campgrounds/profile/:profileid/upload", middleware.isLoggedIn, upload.single("image"), function(req,res) {
    profile.findOne({"user.id": req.params.profileid}, async function(err, updated) {

        if(err) {
            res.redirect("back")
        } else {
            if (req.file) {
                try {
                    if(updated.proPic == null) {
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                        updated.proPicId = result.public_id;
                        updated.proPic = result.secure_url;
                    } else {
                        await cloudinary.v2.uploader.destroy(updated.proPicId);
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                        updated.proPicId = result.public_id;
                        updated.proPic = result.secure_url;
                    }


                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
 

              updated.save();
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/profile/" + req.params.profileid);
        }

    })
})


route.get("/portfolio", function(req,res) {
    res.render("Portfolio/Portfolio")
})

module.exports = route