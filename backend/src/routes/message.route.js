import express from "express";
import { 
  getAllContacts,
  getChatPartners,
  getMessageById,
  sendMessage
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import arcjet from "@arcjet/node";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection,protectRoute);// these middlewares will be applied to all routes defined below

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessageById);
router.post("/send/:id", sendMessage);

export default router;