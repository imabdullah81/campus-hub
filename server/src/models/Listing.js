const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Books",
                "Laptops",
                "Accessories",
                "Hostel Items",
                "Furniture",
                "Others"
            ]
        },

        condition: {
            type: String,
            enum: ["New", "Like New", "Used"]
        },

        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        ],

        location: {
            type: String
        },

        status: {
            type: String,
            enum: ["available", "sold"],
            default: "available"
        },

        views: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    });

listingSchema.index({ category: 1 });
listingSchema.index({ sellerId: 1 });

module.exports = mongoose.model("Listing", listingSchema);