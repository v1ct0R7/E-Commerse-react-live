import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// log in
const loginUser = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const { password } = req.body
    try {
        if (!email || typeof password !== "string" || !password || password.length > 128) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }
        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }
        const token = createToken(user._id)
        res.json({ success: true, token, role: user.role, name: user.name })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Unable to log in" })
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

//register user

const registerUser = async (req, res) => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const password = req.body.password;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    try {
        if (!name || name.length > 100 || !email || typeof password !== "string" || !password || password.length > 128) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }
        // checking is user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }
        // validate email format & strong pass
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(201).json({ success: true, token, role: user.role, name: user.name })

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        res.status(500).json({ success: false, message: "Unable to register" })
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, "name email role createdAt").sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load customers" });
    }
};

export {
    loginUser,
    registerUser,
    listUsers
}