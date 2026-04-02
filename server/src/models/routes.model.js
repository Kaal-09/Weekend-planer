import mongoose from "mongoose";

const { Schema } = mongoose;

// GeoJSON Point Schema
const pointSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
    },
    coordinates: {
        type: [Number], // [lng, lat]
        required: true,
    },
});


const routeSchema = new Schema(
    {
        start: pointSchema,

        end: pointSchema,

        distance: {
            type: Number, // in km
            required: true,
        },

        duration: {
            type: Number, // in minutes
            required: true,
        },

        geometry: [
            {
                type: [Number], // [lng, lat]
            }
        ],

        associatedTrip: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
        },
    },
    {
        timestamps: true,
    }
);


routeSchema.index({ start: "2dsphere" });
routeSchema.index({ end: "2dsphere" });


const Route = mongoose.model("Route", routeSchema);

export default Route;