import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            throw new Error(401, 'Unauthroized request, no token found')
        }
        console.log('accesss token found, peparing to remove it');
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user) {
            const err = new Error("No user found");
            err.statusCode = 401;
            throw err;
        }
    
        req.user = user;
        next(); 
    } catch (error) {
        console.log("JWT ERROR:", error.message); 

        return res.status(401).json({
            message: error.message || "Unauthorized request"
        });
    }
}