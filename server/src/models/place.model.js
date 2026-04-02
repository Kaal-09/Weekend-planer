import mongoose from "mongoose";

const { Schema } = mongoose;

const placeSchema = new Schema({
    name: {
        type: String,
        require: true,
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        },
    },

    category: {
        type: String,
        enum: ["park", "cafe", "restorant", "museum"],
    },

    tags: [String], // OSM,

    rating: {
        type: Number | null,
        default: null,
    },
    
    pupularityNumber: {
        type: Number | null,
        default: null,
    },
    
    openingHours: {
        type: String | null,
        default: null,
    },

    estimatedPerPersonCost: {
        type: Number | null,
        default: null,
    },

    avgVisitDuration: {
        type: Number | null,
        default: null,
    },

    images: [
        {type: String}
    ],
}, {timestamps: true});

userSchema.index({ location: "2dsphere" });

const Place = mongoose.model("Place", placeSchema)