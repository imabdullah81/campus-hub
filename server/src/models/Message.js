const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String
        },

        messageType: {
            type: String,
            enum: ["text", "image"],
            default: "text"
        },

        imageUrl: {
            type: String
        },

        isSeen: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    });

messageSchema.index({ chatId: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);