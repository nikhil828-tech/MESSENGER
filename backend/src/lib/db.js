import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () =>{
    try{
        const {MONGO_URI} = ENV;
        if(!MONGO_URI){
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("MONGODB CONNECTED",conn.connection.host);
        
    }catch (error){
        console.error("Error connection to Mongodb", error);
        process.exit(1);//1 status code means fail, 0 mean success
    }

}