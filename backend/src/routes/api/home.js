import express from "express";
import multer from "multer";
import { getStudiosId } from "../../dao/user_dao.js";
import { getStudio } from "../../dao/studio_dao.js";

const router = express.Router();

const upload = multer({
	dest: "./uploads",
});

router.get("/:id/studios", async (req, res) => {
    try{ 
        const {id} = req.params;
        const studioIds = await getStudiosId(id);
        const studios = [];
        for (let i = 0; i < studioIds.length; i++) {
            const studio = await getStudio(studioIds[i]);
            studios.push(studio[0]);
        }
        return res.status(200).json(studios);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;