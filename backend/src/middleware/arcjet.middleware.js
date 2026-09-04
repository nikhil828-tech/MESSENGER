import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try{
    const decision = await aj.protect(req);

    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            return res.status(429).json({message:"Rate Limit exceed.Please try again later" })
        }
    else if(decision.reason.isBot()){
        return res.status(403).json({message:"Bot detected. Access denied."});
    } else {
      return res.status(403).json({message: "Access denied by security policy."});
    }
    }
    //check for spoofed bot
    if(decision.results.some(isSpoofedBot)){
      return res.status(403).json({
        error: "Spoofed bot detecded.",
        message:"Malicious bot activity detected.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in arcjetProtection middleware:", error);
    next();
  }
}