import express from "express";
import {getUser, getUserbyId} from "../../database/user_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    console.log("getting user " + id)
    if (!id) {
       return res.status(400).json({msg: "No user id provided"});
    }
    try {
      var user = await getUser(id);
      console.log(user)
      if (!user) {
        console.log("user is null")
        user = await getUserbyId(id);
        console.log("getting studio user ================================")
      }
      console.log("got user " + user);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
});

export default router;
