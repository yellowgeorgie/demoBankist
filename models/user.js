const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = model('Users', userSchema);

module.exports = User;
