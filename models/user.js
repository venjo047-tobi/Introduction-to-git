var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    campgrounds: {
        
        name: String,
        image: String,
        description: String,
    }
})

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("user", userSchema)