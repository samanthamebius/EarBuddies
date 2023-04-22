import express from "express";
import {getUser} from "../../database/user_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
    console.log("called user!")
    const {id} = req.params;
  try {
    console.log("in user.js");
    const user = await getUser(id);
    console.log("in user.js " + user + "!");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
