import mongoose from "mongoose";

const { Schema } = mongoose;

const stopSchema = new Schema({
    placeId: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required: true,
    },

    order: {
        type: Number,
        required: true,
    },

    plannedArrivalTime: {
        type: Date,
    },

    plannedDuration: {
        type: Number,
    },
});


const tripSchema = new Schema(
    {
        userIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        stops: [stopSchema],

        totalDistance: {
            type: Number, // in km
        },

        totalTime: {
            type: Number,
        },

        estimatedCost: {
            type: Number,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["planned", "ongoing", "completed"],
            default: "planned"
        },

        associatedRoutes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Route",
            }
        ]
    },
    {timestamps: true,}
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;