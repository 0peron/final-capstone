var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var bookSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true
    }

});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
