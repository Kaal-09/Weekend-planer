import jwt from 'jsonwebtoken'
import User from '../models/user.model';

export const verifyJWT = async (req, _, next) => {
    try {
        const token = req.cookie?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) {
            throw new Error(401, 'Unauthroized request')
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select("password -refreshToken");
        if(!user) {
            throw new Error(401, 'Invalid access token');
        }
    
        req.user = user;
        next(); 
    } catch (error) {
        throw new Error(401, error?.message || 'invalid access token');
    }
}