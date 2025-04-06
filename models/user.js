const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
// this passport-local-mongoose provides the functionality of username and password for userSchema
// which means you dont need to define it in the schema creation!!
// the username and password are in hashed form with a automatically provided salt!

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    // username,
    // password
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
