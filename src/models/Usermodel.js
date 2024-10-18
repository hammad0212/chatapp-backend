import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);
export default User
//module.exports = User;
