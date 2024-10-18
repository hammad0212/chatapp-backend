import jwt from "jsonwebtoken";

export default async function genrateToken(id) {
    const token= jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    console.log(token)
    return token;
}