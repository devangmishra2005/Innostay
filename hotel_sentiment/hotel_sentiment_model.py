

import pandas as pd
import re
import string
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import numpy as np

# Step 1 Load Dataset
import os

current_dir = os.path.dirname(__file__)
csv_path = os.path.join(current_dir, "hotel-reviews.csv")

df = pd.read_csv(csv_path)

df = df[['Description', 'Is_Response']].dropna()
 
# Step 2 Clean Text
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(f"[{string.punctuation}]", "", text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

df['cleaned_text'] = df['Description'].apply(clean_text)
df['label'] = df['Is_Response'].map({'happy': 1, 'not happy': 0})

# Step 3 Visualize Review Sentiment Distribution
plt.figure(figsize=(6,4))
sns.countplot(x='Is_Response', data=df, palette='crest')
plt.title("Overall Hotel Review Sentiment Distribution", fontsize=13, weight='bold')
plt.xlabel("Sentiment Type")
plt.ylabel("Number of Reviews")
plt.tight_layout()
plt.show()

# Step 4 Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    df['cleaned_text'], df['label'], test_size=0.2, random_state=42, stratify=df['label']
)

# Step 5 TF-IDF Vectorization
vectorizer = TfidfVectorizer(
    max_features=8000,
    stop_words='english',
    ngram_range=(1,2)
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Step 6 Train Model
model = LogisticRegression(max_iter=300, class_weight='balanced', solver='liblinear')
model.fit(X_train_vec, y_train)

# Step 7 Evaluate Model
y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)

print("\n✅ MODEL EVALUATION")
print("-------------------")
print("Accuracy:", round(acc, 4))
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=['Not Happy', 'Happy']))

# Step 8 Confusion Matrix Visualization
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Predicted: Not Happy', 'Predicted: Happy'],
            yticklabels=['Actual: Not Happy', 'Actual: Happy'])
plt.title("Sentiment Prediction Performance Matrix", fontsize=13, weight='bold')
plt.xlabel("Predicted Sentiment")
plt.ylabel("Actual Sentiment")
plt.tight_layout()
plt.show()

# Step 9 Convert Model Probabilities into Star Ratings
y_probs = model.predict_proba(X_test_vec)[:, 1]

def map_to_rating(prob):
    if prob >= 0.9:
        return 5
    elif prob >= 0.7:
        return 4
    elif prob >= 0.5:
        return 3
    elif prob >= 0.3:
        return 2
    else:
        return 1

ratings = [map_to_rating(p) for p in y_probs]
rating_df = pd.DataFrame({'Predicted_Rating': ratings})

# Step 10 Customer Satisfaction Rating Distribution (Horizontal Bars)
rating_counts = rating_df['Predicted_Rating'].value_counts().sort_index(ascending=False)
colors = ['#2E7D32', '#66BB6A', '#D4E157', '#FFB300', '#E64A19']  # green to orange

plt.figure(figsize=(7,4))
bars = plt.barh(rating_counts.index.astype(str) + " ★", rating_counts.values, color=colors)
total = sum(rating_counts.values)
ax = plt.gca()

# Expand the x-axis so all values fit comfortably
max_width = max(rating_counts.values)
plt.xlim([0, max_width * 1.15])

for bar, count in zip(bars, rating_counts.values):
    percent = (count / total) * 100
    xpos = bar.get_width() + 10
    plt.text(
        xpos,
        bar.get_y() + bar.get_height()/2,
        f"{count} ({percent:.1f}%)",
        va='center', ha='left', fontsize=11, color='black', clip_on=True
    )

plt.gca().invert_yaxis()
plt.title("Customer Satisfaction Rating Distribution", fontsize=13, weight='bold')
plt.xlabel("Number of Reviews")
plt.ylabel("Rating Level")
plt.tight_layout()
plt.show()

# Step 11 Sample Predictions
samples = [
    "The room was dirty and the staff was rude.",
    "The hotel was amazing with friendly staff and clean rooms.",
    "Service was okay but not worth the price."
]
sample_vec = vectorizer.transform(samples)
preds = model.predict(sample_vec)

print("\n🧾 SAMPLE PREDICTIONS")
for review, label in zip(samples, preds):
    sentiment = "Happy 😊" if label == 1 else "Not Happy 😞"
    print(f"Review: {review}\n→ Predicted Sentiment: {sentiment}\n")

# Step 12 Save Model and Vectorizer
joblib.dump(model, "sentiment_model_final.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer_final.pkl")
print("✅ Model and vectorizer saved successfully!")
