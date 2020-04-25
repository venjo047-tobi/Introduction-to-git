var mongoose = require("mongoose");
var camping = require("./models/camping");
var Comment = require("./models/comment")


var data = [
    {
        name: "The Seaside",
        image: "https://s.yimg.com/ny/api/res/1.2/d3gU1M2bVx1X8FnWKzs.lQ--~A/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAw/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2019-10/7198acf0-ea82-11e9-b29e-618c97d6312f",
        description: "Nam semper libero diam, eget ullamcorper ex venenatis euismod. Aenean sit amet blandit felis. Morbi laoreet sit amet diam sed varius. Suspendisse potenti. Nunc elementum pharetra maximus. Vestibulum in dolor vel eros interdum dictum a at ipsum. Sed at libero quis lectus rhoncus accumsan. Vestibulum non enim ligula. Fusce euismod, elit a sagittis fringilla, dui massa suscipit mi, et commodo nulla odio sed sapien. Nam non justo sit amet dui feugiat dictum."
    },
    {
        name: "The Buildside",
        image: "https://s3-media2.fl.yelpcdn.com/bphoto/UOd4qPofzsR2pMzr_LKx1w/o.jpg",
        description: "Nam semper libero diam, eget ullamcorper ex venenatis euismod. Aenean sit amet blandit felis. Morbi laoreet sit amet diam sed varius. Suspendisse potenti. Nunc elementum pharetra maximus. Vestibulum in dolor vel eros interdum dictum a at ipsum. Sed at libero quis lectus rhoncus accumsan. Vestibulum non enim ligula. Fusce euismod, elit a sagittis fringilla, dui massa suscipit mi, et commodo nulla odio sed sapien. Nam non justo sit amet dui feugiat dictum."
    },
    {
        name: "The Terraceside",
        image: "https://freshome.com/wp-content/uploads/2012/04/Poolside-terraces-Freshome-27.jpg",
        description: "Nam semper libero diam, eget ullamcorper ex venenatis euismod. Aenean sit amet blandit felis. Morbi laoreet sit amet diam sed varius. Suspendisse potenti. Nunc elementum pharetra maximus. Vestibulum in dolor vel eros interdum dictum a at ipsum. Sed at libero quis lectus rhoncus accumsan. Vestibulum non enim ligula. Fusce euismod, elit a sagittis fringilla, dui massa suscipit mi, et commodo nulla odio sed sapien. Nam non justo sit amet dui feugiat dictum."
    },
    {
        name: "The Sidechick",
        image: "https://www.girlschase.com/media/2017/02/pick-up-girls-swimming-pool-3.jpg",
        description: "Nam semper libero diam, eget ullamcorper ex venenatis euismod. Aenean sit amet blandit felis. Morbi laoreet sit amet diam sed varius. Suspendisse potenti. Nunc elementum pharetra maximus. Vestibulum in dolor vel eros interdum dictum a at ipsum. Sed at libero quis lectus rhoncus accumsan. Vestibulum non enim ligula. Fusce euismod, elit a sagittis fringilla, dui massa suscipit mi, et commodo nulla odio sed sapien. Nam non justo sit amet dui feugiat dictum."
    },
]


function seedDB() {
    camping.deleteMany({}, function(err, deleted) {
        // if(err){
        //     console.log("deleted")
        // } else {
        //     console.log("deleted");
        //     data.forEach(function(seed){
        //         camping.create(seed, function(err,created){
        //             if(err) {
        //                 console.log("error1")
        //             } else {
        //                 Comment.create({
        //                     text:"anak ng tupa",
        //                     author: "homer"
        //                 }, function(err, data) {
        //                     if(err) {
        //                         console.log("error2")
        //                     } else {
        //                         created.comment.push(data),
        //                         created.save(function(err,saved) {
        //                             if(err) {
        //                                 console.log("error3")
        //                             } else {
        //                                 console.log(saved)
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        //         })
        //     })
        // }
        
    })
}


module.exports = seedDB
