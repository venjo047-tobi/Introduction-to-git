var middleware = {};
var comment = require("../models/comment");

middleware.checkOwnership = function(req,res,next) {
    if(req.isAuthenticated()){
        comment.findById(req.params.commentId, function(err,found){
            if(err){
                res.redirect("back")
            } else {
                if (!found) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }

                if(found.author.id.equals(req.user._id)){
                    next()
                } else {
                    req.flash("error", "Unauthorized")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Unauthorized")
        res.redirect("back")
        
    }
}


middleware.isLoggedIn = function (req,res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Login First")
    res.redirect("/login")
}


module.exports = middleware