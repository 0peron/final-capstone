var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

usersSchema.methods.validatePassword = function(password) {
    return bcrypt
        .compare(password, this.password)
        .then(isValid => isValid);
};

usersSchema.statics.hashPassword = function(password) {
    return bcrypt
        .hash(password, 8)
        .then(hash => hash);
};

usersSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        userName: this.userName,
        password: this.password,
    };
};

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;