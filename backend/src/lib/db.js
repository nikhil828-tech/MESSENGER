import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED",conn.connection.host);
        
    }catch (error){
        console.error("Error connection to Mongodb", error);
        process.exit(1);//1 status code means fail, 0 mean success
    }

}