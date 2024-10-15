import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    phone: { type: String, trim: true },
    pic: {
        type: String,
        default: "https://i.stack.imgur.com/l60Hf.png",
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
