import express from "express";
import { new_token, new_question, load_history } from "../controllers/chat.js";

const router = express.Router();

router.get("/new_token", new_token);
router.post("/new_question", new_question);
router.post("/load_history", load_history);

export default router;
