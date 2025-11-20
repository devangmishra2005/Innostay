# Hotel Sentiment Service

This directory contains the Python sentiment-analysis assets that power the
MERN application. The model is exposed through a lightweight Flask API so the
Node backend can classify reviews before persisting them.

## Prerequisites

- Python 3.13 (already configured inside `hotel_sentiment/venv`)
- The serialized model artifacts:
  - `sentiment_model_final.pkl`
  - `tfidf_vectorizer_final.pkl`

## Setup

### Windows (PowerShell)
```powershell
cd hotel_sentiment
python -m venv venv          # skip if the venv already exists
.\venv\Scripts\Activate.ps1  # Activate virtual environment
pip install -r requirements.txt
```

### macOS/Linux
```bash
cd hotel_sentiment
python -m venv venv          # skip if the venv already exists
source venv/bin/activate     # Activate virtual environment
pip install -r requirements.txt
```

> If you do not have a `requirements.txt`, install the libraries manually:
> `pip install flask joblib scikit-learn pandas numpy`.

## Run the API

### Windows (PowerShell)
```powershell
cd hotel_sentiment
.\venv\Scripts\Activate.ps1
$env:PORT=5001               # optional, defaults to 5001
python api.py
```

Or use the provided script:
```powershell
.\run_api.ps1
```

### macOS/Linux
```bash
cd hotel_sentiment
source venv/bin/activate
export PORT=5001             # optional, defaults to 5001
python api.py
```

The service exposes:

- `GET /health` – basic readiness probe
- `POST /predict` – accepts `{ "text": "some review" }` and returns a JSON
  payload with the predicted label, rating bucket, and confidence scores.

## Environment variables

| Variable                   | Default                     | Description                                  |
|---------------------------|-----------------------------|----------------------------------------------|
| `PORT`                    | `5001`                      | Port for the Flask server                    |
| `DEBUG`                   | `false`                     | Enables Flask debug mode when set to `true`  |
| `MODEL_VERSION`           | `final`                     | Used for metadata in responses               |
| `SENTIMENT_MODEL_PATH`    | `sentiment_model_final.pkl` | Path to the pickled sklearn model            |
| `SENTIMENT_VECTORIZER_PATH` | `tfidf_vectorizer_final.pkl` | Path to the TF-IDF vectorizer             |

## Next steps

- Keep the service running while developing the MERN backend.
- When deploying, place this API behind your preferred process manager or
  container orchestration platform and update the Node backend with the
  reachable URL.

