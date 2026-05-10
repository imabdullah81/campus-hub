const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        auth0Id: {
            type: String,
            required: true
        },

        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        profileImage: {
            type: String
        },

        bio: {
            type: String
        },

        university: {
            type: String
        },

        phoneNumber: {
            type: String
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);