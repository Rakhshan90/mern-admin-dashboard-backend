const mongoose = require('mongoose');
//creating our user schema
const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        //users cannot be an admin
        isAdmin: { type: Boolean, default: false },
        img: { type: String }
    },

    //timestamps used to create current date and time as well as updates.
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);