import User from "../models/Usermodel.js";
import genrateToken from "../confiq/token.js";
import connectDB from "../confiq/db.js";
import generateToken from "../confiq/token.js";

export async function registeruser(req, res) {
    const { name, email, password, pic } = req.body;
    console.log(req.body); // Add this line to debug



    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please enter all the fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password,
            pic,
        });

        const userSaved = await newUser.save();
        if (userSaved) {
            res.status(201).json({
                _id: userSaved._id,
                name: userSaved.name,
                email: userSaved.email,
                pic: userSaved.pic,
                token: genrateToken(userSaved._id), // Use userSaved._id here
                message: "User registered successfully",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function authuser(req, res) {
    const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user)

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    console.log("token", token)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: genrateToken(user._id),
    });
    
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }   
}

export async function allusers(req, res) {
    console.log("✅ API HIT: /api/user?search=", req.query.search); // Debugging

    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

        console.log("✅ Users Found:", users); // Debugging
        res.json(users || []);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Server Error", users: [] });
    }
}


