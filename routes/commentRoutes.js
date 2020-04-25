var express = require("express"),
    methodOvrd        = require("method-override"),
    route   = express.Router({mergeParams:true}),
    camping = require("../models/camping"),
    comment = require("../models/comment"),
    Middleware = require("../middleware")


    route.use(methodOvrd("_method"))

// show route comment
route.get("/comment/new", Middleware.isLoggedIn, function(req, res) {
    camping.findById(req.params.id, function(err,found) {
        if(err) {
            console.log(err)
        } else {
            res.render("comment/new", {found:found})
        }
        
    })
    
    
})

// create comment route
route.post("/comment", Middleware.isLoggedIn, function(req,res) {
  camping.findById(req.params.id, function(err, find) {
      if(err) {
          console.log(err)
      } else {
          comment.create(req.body.comment, function(err,created) {
              if(err) {
                  console.log("Error")
              } else {
                  created.author.id = req.user._id;
                  created.author.username = req.user.username;
                  created.save()
                  find.comment.push(created),
                  find.save(function(err,saved){
                      if(err){
                          console.log("hindinasave")
                      } else {
                          res.redirect("/campgrounds/" + req.params.id)
                      }
                  })
              }
          })
      }
  })
} )


route.get("/comment/:commentId/edit", Middleware.checkOwnership, function(req,res) {
    comment.findById(req.params.commentId, function(err,found){
        if(err) {
            console.log(err)
        } else {
            var campId = req.params.id
            res.render("comment/edit", {commentData: found, campingData:campId})
        }
    })
    
})


route.put("/comment/:commentId",Middleware.checkOwnership, function(req,res) {
    comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err,updated){
        if(err) {
            console.log("luko")
        } else {
            res.redirect("/campgrounds/" + req.params.id )

        }
    })
    
})


route.delete("/comment/:commentId",Middleware.checkOwnership, function(req,res) {
    comment.findByIdAndRemove(req.params.commentId, function(err,deleted) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})






module.exports = route