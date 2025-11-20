import axios from "axios";

const SENTIMENT_URL =
  process.env.SENTIMENT_URL || "http://127.0.0.1:5001/predict";

const client = axios.create({
  baseURL: SENTIMENT_URL,
  timeout: Number(process.env.SENTIMENT_TIMEOUT_MS || 4000),
});

export async function analyzeReviewText(text = "") {
  if (!text.trim()) {
    return null;
  }

  try {
    const response = await client.post("", { text });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to reach sentiment service",
      error?.response?.data || error.message
    );
    return null;
  }
}

