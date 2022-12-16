import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({

    roomID: {
        type: String,
        required: true
    },
    senderEmail: {
        type: String,
        required: true,
    },
    recieverEmail: {
        type: String,
        required: true,
    },
    chatMsg: {
        type: String,
        required: true,
    },
    publicId: {
        type: String
    },
    sender: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Messages = mongoose.model("Messages", messagesSchema);
export default Messages;