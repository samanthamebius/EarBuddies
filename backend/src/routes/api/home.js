import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({
	dest: "./uploads",
});

router.get("./studios/:id", async (req, res) => {

});