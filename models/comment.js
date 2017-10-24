var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false
    },
    bookId: {
        type: String,
        required: false
    },
    username: String

});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
