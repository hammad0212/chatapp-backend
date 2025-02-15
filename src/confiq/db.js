import mongoose from "mongoose";
import colors from "colors";
 export default  async function connectDB () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
           // useNewUrlParser: true,
          //  useCreateIndex: true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.red.bold);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//module.exports = connectDB
//hammadsunsara9    7WyME5F64YdArgG6