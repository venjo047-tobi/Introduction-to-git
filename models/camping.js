var mongoose = require("mongoose")
var comment = require("./comment")
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    location: String,
    description: String,
    user : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    },
    profile : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"profile"
        },
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
})


campSchema.pre('delete', async function() {
	await comment.remove({
		_id: {
			$in: this.comment
		}
	});
});


module.exports = mongoose.model("camping",campSchema)