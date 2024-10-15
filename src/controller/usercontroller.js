
import User from "../models/Usermodel.js";
import genrateToken from "../confiq/token.js";
import connectDB from "../confiq/db.js";
export  async function registeruser(req, res) {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please enter all the fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
            pic,
            //token:genrateToken(user.id)
        });

        const userSaved = await newUser.save();
        if (userSaved) {
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
