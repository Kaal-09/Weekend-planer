import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const verifyJWT = async (req, _, next) => {
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
        const err = new Error("Unauthorized request");
        err.statusCode = 401;
        throw err;
    }
}