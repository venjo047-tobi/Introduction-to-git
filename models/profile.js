var mongoose = require("mongoose");

var profSchema = new mongoose.Schema({
    name: String,
    gender :String,
    proPic: {type:String, default:null},
    camping :[{
        
        name: String,
        image: String,
        description: String,
        price : Number,

    }],
    user :{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String,
    }
})

module.exports = mongoose.model("profile", profSchema)