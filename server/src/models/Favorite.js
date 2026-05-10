const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Favorite", favoriteSchema);