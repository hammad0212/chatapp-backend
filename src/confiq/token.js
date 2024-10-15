import jwt from "jsonwebtoken";

export default async function genrateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}