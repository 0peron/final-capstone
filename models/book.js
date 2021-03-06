var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    idValue: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
     username: String
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
