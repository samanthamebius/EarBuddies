import express from "express";
import {getCurrentUser} from "../../database/user_dao";

const router = express.Router();

router.get("/", async (req, res) => {
    console.log("called user!")
  try {
    console.log("in user.js");
    const user = await getCurrentUser();
    console.log("in user.js " + user + "!");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
