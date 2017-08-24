var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: {
        type:String,
        required: false,
        ref: 'Book'
    },
    _id: {
        type: Number,
        required: false,
    }

});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
