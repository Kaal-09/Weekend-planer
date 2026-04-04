import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import User from '../models/user.model';

export const generateToken = (userId, userEmail, res) => {
    const token = jwt.sign({ _id: userId, email: userEmail }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.cookie("token", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token; 
}

export const generateRefreshToken = async (userId, res) => {
    try {
        const user = User.findOneById(userId);
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return refreshToken;
    } catch (error) {
        console.log(error);
        
        throw new Error(500, 'Some error occured while creating refreshToken');
    }
}

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URI);

        console.log(`MongoDB connected on host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); 
    }
}