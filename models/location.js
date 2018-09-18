const mongoose = require("mongoose");
mongoose.plugin(schema => {
    schema.options.usePushEach = true
});

// Schema Setup
const locationSchema = new mongoose.Schema({
    name: String,
    cost: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdOn: {type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("location", locationSchema);
