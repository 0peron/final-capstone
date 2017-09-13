var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: {
        type:String,
        required: false
    },
    commentId: {
        type: Number,
        required: false,
    }

});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
