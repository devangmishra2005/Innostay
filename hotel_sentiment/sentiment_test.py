from textblob import TextBlob

review = "bad day"
sentiment = TextBlob(review).sentiment.polarity

if sentiment > 0:
    print("Positive Review")
elif sentiment < 0:
    print("Negative Review")
else:
    print("Neutral Review")
