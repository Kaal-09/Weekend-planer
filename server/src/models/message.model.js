import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "receiverModel",
        },

        receiverModel: {
            type: String,
            required: true,
            enum: ["User", "ChatGroup"],
        },

        content: {
            type: String,
            required: true,
        },

        seenBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;