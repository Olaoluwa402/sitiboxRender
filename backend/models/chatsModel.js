import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema({
    recieverEmail: {
        type: String,
        required: true,
    },
    senderEmail: {
        type: String,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        default: Date.now
    }

});

const Chats = mongoose.model("Chats", chatsSchema);
export default Chats;