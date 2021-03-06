var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    commentRef: [{ type: mongoose.Schema.Types.ObjectId, ref:'comments'}]
});

UserSchema.methods.apiRepr = function() {
    return {
        username: this.username || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
