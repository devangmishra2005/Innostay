import { analyzeReviewText } from "../services/sentiment.service.js";

export const predictSentiment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    const sentiment = await analyzeReviewText(text);

    if (!sentiment) {
      return res
        .status(503)
        .json({ message: "Sentiment service unavailable. Try again later." });
    }

    return res.json(sentiment);
  } catch (error) {
    console.error("predictSentiment error:", error);
    return res.status(500).json({ message: "Unable to predict sentiment" });
  }
};

