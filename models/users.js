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
    console.log('this is:', this.password);
    return bcrypt.compareSync(password, this.password);
};

usersSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

usersSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        userName: this.userName,
        password: this.password
    };
};

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;

