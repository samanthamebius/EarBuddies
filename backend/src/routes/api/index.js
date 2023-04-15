import express from "express";

const router = express.Router();

import login from "./login";
router.use("/login", login);

import refresh from "./refresh";
router.use("/refresh", refresh);

import chat from "./chat";
router.use("/chat", chat);

//tester api call
router.get("/hello", (req, res) => {
	res.send("Hello, World");
});

export default router;
