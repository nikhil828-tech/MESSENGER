import express from "express";
const router = express.Router();

router.get("/signup", (req, res) => {
  // Handle user signup logic here
  res.send("Signup endpoint");
});

router.get("/login", (req, res) => {
  res.send("Login endpoint");
});

router.get("/logout", (req, res) => {
  res.send("Logout endpoint");
});

export default router;