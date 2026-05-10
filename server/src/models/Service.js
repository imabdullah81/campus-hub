const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Tutoring",
                "Design",
                "Programming",
                "Writing",
                "Marketing",
                "Others"
            ],
            required: true
        },

        pricingType: {
            type: String,
            enum: ["fixed", "hourly"],
            default: "fixed"
        },

        price: {
            type: Number,
            required: true
        },

        skills: [String],

        images: [String],

        availability: {
            type: String
        }

    },
    {
        timestamps: true
    });

serviceSchema.index({ category: 1 });
serviceSchema.index({ providerId: 1 });

module.exports = mongoose.model("Service", serviceSchema);