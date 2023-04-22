import express from "express";
import {getUser} from "../../database/user_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
    console.log("called user!")
    const {id} = req.params;
    if (id.length == 2 || id == null) {
       return res.status(400).json({msg: "No user id provided"});
    }
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
