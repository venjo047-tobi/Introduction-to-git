var express = require("express"),
    profile = require("../models/profile"),
    camping = require("../models/camping"),
    middleware = require("../middleware"),
    route = express.Router();


route.get("/campgrounds/profile/:profileid", middleware.isLoggedIn, function(req,res) {
    profile.findOne({"user.id": req.params.profileid}, function(err,found){
        if(err) {
            console.log(err)
        } else {
            console.log(found.gender)
            res.render("profilePage/profile", {data:found})

        }
    })
})


route.get("/campgrounds/profile/:profileid/edit/:id" , function(req,res) {

})





// route.delete("/campgrounds/profile/:profileid", function(req,res) {
//     profile.findOne({"user._id": req.user_id}, function(err,found) {
//         if(err) {
//             console.log(err)
//         } else {

//             profile.updateOne( 
//                 {"_id": found._id },
//                 { $pull: { camping : { _id : req.params.profileid } } },
                
//                 function removeConnectionsCB(err, obj) {
//                     if(err) {
//                         console.log(err)
//                     } else {
//                         camping.findOneAndDelete({"user.id": req.user._id}, function(err,deleted){
//                             if(err){
//                                 console.log(err)
//                             } else {
//                                 res.redirect("back")
//                             }
//                         })
                        
//                     }
//                 });
                
            
//         }
//     })
// })



module.exports = route