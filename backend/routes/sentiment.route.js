import { Router } from "express";
import { predictSentiment } from "../controllers/sentiment.controller.js";
import isAuth from "../middleware/isAuth.js";

const sentimentRouter = Router();

sentimentRouter.post("/", isAuth, predictSentiment);

export default sentimentRouter;

