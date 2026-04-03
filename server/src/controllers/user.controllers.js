import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";

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

        generateToken(user._id.toString(), res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};