import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js"

export const socketAuthMiddleware = async (socket, next) => {
    try {
        //extract token from http-only cookies
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            console.log("socket connection rejected :invlaid token ");
            return next(new Error("Unauthorzied - Invalid Token"));

        }

        // verify the token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        //find the user frommdb
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket connetion rejected:User not found");
            return next(new Error("User not found"));
        }

        //attacj user info to socket
        socket.user = user;
        socket.userId = user._id.toString();

        

        next();
    } catch (error) {
        console.log("Error in socket authentication:", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }
}