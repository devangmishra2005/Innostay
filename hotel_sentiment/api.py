import os
import re
import string
from pathlib import Path

import joblib
from flask import Flask, jsonify, request


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / os.getenv("SENTIMENT_MODEL_PATH", "sentiment_model_final.pkl")
VECTORIZER_PATH = BASE_DIR / os.getenv(
    "SENTIMENT_VECTORIZER_PATH", "tfidf_vectorizer_final.pkl"
)


def _load_artifact(path: Path, label: str):
    if not path.exists():
        raise FileNotFoundError(f"{label} not found at {path}")
    return joblib.load(path)


model = _load_artifact(MODEL_PATH, "Model")
vectorizer = _load_artifact(VECTORIZER_PATH, "Vectorizer")

app = Flask(__name__)


def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(f"[{re.escape(string.punctuation)}]", "", text)
    text = re.sub(r"\w*\d\w*", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def map_to_rating(prob: float) -> int:
    if prob >= 0.9:
        return 5
    if prob >= 0.7:
        return 4
    if prob >= 0.5:
        return 3
    if prob >= 0.3:
        return 2
    return 1


@app.get("/health")
def health():
    return jsonify({"status": "ok", "modelVersion": os.getenv("MODEL_VERSION", "final")})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()

    if not text:
        return jsonify({"message": "text is required"}), 400

    cleaned = clean_text(text)
    vectorized = vectorizer.transform([cleaned])

    probabilities = model.predict_proba(vectorized)[0]
    label_idx = int(model.predict(vectorized)[0])
    positive_probability = float(probabilities[1])
    negative_probability = float(probabilities[0])
    label = "positive" if label_idx == 1 else "negative"
    confidence = positive_probability if label == "positive" else negative_probability

    response = {
        "label": label,
        "confidence": round(confidence, 4),
        "positiveProbability": round(positive_probability, 4),
        "negativeProbability": round(negative_probability, 4),
        "rating": map_to_rating(positive_probability),
        "modelVersion": os.getenv("MODEL_VERSION", "final"),
    }
    return jsonify(response)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("DEBUG", "false").lower() == "true")

