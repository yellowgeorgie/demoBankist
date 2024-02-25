const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

// userSchema.post("findOneAndDelete", async function (transaction) {
//     if (transaction) {

//     }
// });

const User = model('User', userSchema);

module.exports = User;
