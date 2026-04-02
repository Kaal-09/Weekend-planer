import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    peoples: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
        }
    ]
});

const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: true,
    },

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    occupation: {
        type: String,
        enum: ['Student', 'Professional', 'Researcher', 'Educator', 'Other'],
        default: 'Professional'
    },

    chatgroups: [
        {
            type: Schema.Types.ObjectId,
            ref: "ChatGroup",
        }
    ],

    prefrences: {
        categories: [{
            type: String,
            enum: ["nature", "food", "adventure"]
        }],
        budget: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        travelRadius: {
            type: Number,
            default: 10, // km
        }
    },

    homeLocation: {
        lat: {
            type: Number,
            default: 25.000,
        },
        long: {
            type: Number,
            default: 71,
        }
    },

    savedPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
    }],

    savedTrips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
    }]
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export { User, ChatGroup };