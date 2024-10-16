import User from "../models/Usermodel.js";
import genrateToken from "../confiq/token.js";
import connectDB from "../confiq/db.js";

export async function registeruser(req, res) {
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
           // token:genrateToken(user._id)
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

export async function authuser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {      
        return res.status(400).json({ error: "Please enter all the fields" });
    }
    try {
        const user = await User.findOne({ email }); 
        const token=await genrateToken(user.id)
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                message: "User successfully logged in",
                token:token
               
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }   
}
export async function allusers(req, res) {
   const keyword=req.query.search
   ?{
       $or:[
           {name:{$regex:req.query.search,$options:"i"}},
           {email:{$regex:req.query.search,$options:"i"}},
       ]
   }
   :{}
   const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
   res.send(users)
   }

