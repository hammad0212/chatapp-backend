import jwt from "jsonwebtoken";
import User from "../models/Usermodel.js";
import asyncHandler from "express-async-handler";
//import jwt from "jsonwebtoken";
//import User from "../models/Usermodel.js";
//import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
    console.log("🔍 Checking Token..."); // Log when middleware starts

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("✅ Extracted Token:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Decoded Token:", decoded);

            req.user = await User.findById(decoded.id).select("-password");
            console.log("✅ Authenticated User:", req.user);

            next(); // ✅ Move to next middleware
        } catch (error) {
            console.error("❌ Token Verification Failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } else {
        console.error("❌ No Token Provided");
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

