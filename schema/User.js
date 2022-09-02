const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "firstname is required"],
    },
    lastname: {
        type: String,
        required: [true, "lastname is required"],
    },
    email: {
        type: String,
        required: [true, "user's email is required"],
        unique: [true, "email should be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    userType: {
        type: String,
        default: "student"
    }
}, { timestamps: true })

const User = mongoose.model("user", userSchema);
User.createIndexes()
module.exports = User