import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId,res) => {
    const token = jwt.sign({userId}, ENV.JWT_SECRET,{expiresIn : "7d",});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*100,//MILLSEC
        htttpOnly:true,//prevent XSS attact:cross-site scripting
        sameSite:"strict",//CSRF ATTACKS
        secure:ENV.NODE_ENV === "development" ? false:true,
    });
    return token;
};