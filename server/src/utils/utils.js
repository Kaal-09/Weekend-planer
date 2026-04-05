import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const generateToken = (userId, userEmail) => {
    return jwt.sign(
        { _id: userId, email: userEmail },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export const generateRefreshToken = async (userId) => {
    const user = await User.findById(userId);

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return refreshToken;
};

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URI);

        console.log(`MongoDB connected on host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); 
    }
}