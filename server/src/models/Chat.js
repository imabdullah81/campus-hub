const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        lastMessage: {
            type: String
        },

        lastMessageTime: {
            type: Date
        }

    },
    {
        timestamps: true
    });

chatSchema.index({ participants: 1 });

module.exports = mongoose.model("Chat", chatSchema);