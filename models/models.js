var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }

});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
