const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reportedBy: {
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
        },

        reason: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "reviewed"],
            default: "pending"
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Report", reportSchema);