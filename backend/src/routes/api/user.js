import express from "express";
import { getUser, getUserbyId, deleteUser, updateUserInfo } from "../../dao/user_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: "No user id provided" });
    }
    try {
        var user = await getUser(id);
        if (!user) {
            user = await getUserbyId(id);
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: "No user id provided" });
    }
    try {
        await updateUserInfo(id, req.body.userDisplayName, req.body.spotifyPic, req.body.profilePic);
        res.status(204).json({ msg: "User updated" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: "No user id provided" });
    }
    try {
        await deleteUser(id);
        res.status(204).json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
