import express from "express";
import multer from "multer";
import { getStudiosId } from "../../dao/user_dao.js";

const router = express.Router();

const upload = multer({
	dest: "./uploads",
});

router.get("/:id/studios", async (req, res) => {
    console.log("in home.js");
    try{ 
        const {id} = req.params;
        console.log("id " + id);
        const studios = await getStudiosId(id);
        console.log("studios " + studios);
        return res.status(200);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

export default router;