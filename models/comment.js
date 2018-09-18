const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    createdOn: {type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Comment", commentSchema);