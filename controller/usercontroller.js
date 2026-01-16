import User from "../models/UserModle.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Please give name" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "please give a valid email.",
            });
        }

        const exstingUser = await User.findOne({ email: email });

        if (exstingUser) {
            return res.status(400).json({ message: "User already exist!" });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(15);
        const hashPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashPass,
            role: role || "user", // Default to user if not provided
        });

        await newUser.save();
        const token = createToken(newUser._id);

        return res
            .status(201)
            .json({ success: true, message: "User registered !", token });
    } catch (err) {
        console.log(`Error while register new User : ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createToken = (user_id) => {
    return jwt.sign({ user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Please fill all fields." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Wrong email or password." });
        }

        const token = createToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // admin or user
            },
        });
    } catch (err) {
        console.log(`Error while login: ${err.message}`);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const authMe = async (req, res) => {
    const userId = req.userId;
    try {
        const userData = await User.findById(userId);

        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "User Not Found!" });
        }
        return res
            .status(200)
            .json({ success: true, user_id: userData._id, user_name: userData.name, role: userData.role });
    } catch (error) {
        console.log(`Error finding auth me!`);
        return res.status(500).json({ success: false, message: error.message });
    }
};
