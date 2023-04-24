import express from "express";
import {getUser} from "../../database/user_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    if (!id) {
       return res.status(400).json({msg: "No user id provided"});
    }
    try {
      const user = await getUser(id);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
});

export default router;
