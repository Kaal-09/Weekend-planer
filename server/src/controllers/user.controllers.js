import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../utils/utils.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    const {userName, email, password, age}= req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const user = await User.create({
            userName, email, password: hashedPassword, age
        });
        if(user) {
            generateToken(user._id.toString(), res);
            await user.save();

            res.status(201).json({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                age: user.age,
            })
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in signup controller", error.message);
        } else {
            console.log("Unknown error:", error);
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginUser = async (req, res)=> {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = generateToken(user._id.toString(), res);
        const refreshToken = generateRefreshToken(user._id, res);

        const option = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
        .cookie("accesstoken", token, option)
        .cookie("refreshToken", refreshToken, option).
        json({
            _id: user._id,
            fullName: user.userName,
            email: user.email,
            profilePic: user.profilePic | null,
            token: token,
            refreshToken: refreshToken,
        });

    } catch (error) {
        console.log("Error in login controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accesstoken", option)
    .clearCookie("refreshToken", option)
    .json({
        status: 200,
        message: 'User logged out.'
    });
}

export const refreshAccessToken = async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incommingRefreshToken) {
        throw new Error(401, 'Unauthroized requiest');
    }

    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_KEY,
        )
        const user = await User.findById(decodedToken._id)
        if(!user) {
            throw new Error(401, 'Unauthroized requiest');
        }
    
        if(incommingRefreshToken !== user.refreshToken){
            throw new Error(401, 'Refresh token is not matching');
        }
        const options = {
            httpOnly: true,
            secure: true,
        }
        const accessToken = generateToken(user._id.toString(), res);
        const refreshToken = await generateRefreshToken(user._id, res);
    
        return res.status(200)
        .cookie("acesstoken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            status: 200,
            message: 'Tokens are returned',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        console.log(error);
        throw new Error("Error in refreshAccesToken");
        
    }
}