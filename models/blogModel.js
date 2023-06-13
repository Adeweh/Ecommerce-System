const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisLiked:{
        type: Boolean,
        default: false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        default: "User",
    },],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        default: "User",
    },],
    image:{
        type:String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREgQ1h0NR-YTLxlS0Ld4gAgWOhb-P7ZFSBo84LwBFkYmXz4ilwYHdlbwM-3XhFiZlIFM8&usqp=CAU",
    },
    author:{
        type:String,
        default: "Admin"
    },
    images: [],
}, {
    toJSON: {
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);