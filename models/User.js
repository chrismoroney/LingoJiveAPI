const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: {type: String, select: false},
    confirmpassword: {type: String, select: false},
    bio: {type: String, default: ""},
    langExp: [String],
    langLearn: [String],
    onlineStatus: Boolean,
    following: [String],
    blocked: [String],
    blocking: [String],
    blockedBy: [String],
    profileImage: {type: String, default: ""},
    overallFluency: [Number],
    pronunciation: [Number],
    conversationalAbility: [Number],
    listening: [Number],
    speaking: [Number]
});

module.exports = mongoose.model('User', UserSchema);
