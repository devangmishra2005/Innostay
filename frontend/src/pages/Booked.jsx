import React, { useContext, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { bookingDataContext } from "../Context/BookingContext";

import { useNavigate } from "react-router-dom";
import Star from "../Component/Star";

import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";
import { listingDataContext } from "../Context/ListingContext";
import axios from "axios";

function Booked() {
  let { bookingData } = useContext(bookingDataContext);
  let [star, setStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sentimentResult, setSentimentResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentError, setSentimentError] = useState("");
  let { serverUrl } = useContext(authDataContext);

  let { getCurrentUser } = useContext(userDataContext);
  let { getListing, cardDetails } = useContext(listingDataContext);

  let navigate = useNavigate();

  

  const handleSubmit = async (id) => {
    try {
      if (!reviewText.trim()) {
        setSentimentError("Please share your experience before submitting.");
        return;
      }

      let ratingResult = await axios.post(
        serverUrl + `/api/listing/ratings/${id}`,
        {
          ratings: star,
        },
        { withCredentials: true }
      );

      let reviewResult = await axios.post(
        serverUrl + `/api/listing/reviews/${id}`,
        {
          review: reviewText,
        },
        { withCredentials: true }
      );
      await getListing();
      await getCurrentUser();

      console.log("rating: ", ratingResult);
      console.log("review: ",reviewResult);
      setReviewText("");
      setSentimentResult(null);
      setSentimentError("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleStar = async (value) => {
    setStar(value);
    console.log("you rated", value);
  };

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      setSentimentError("Type a review to analyze.");
      setSentimentResult(null);
      return;
    }

    setSentimentError("");
    setIsAnalyzing(true);
    try {
      const { data } = await axios.post(
        serverUrl + `/api/sentiment`,
        { text: reviewText },
        { withCredentials: true }
      );
      setSentimentResult(data);
    } catch (error) {
      setSentimentResult(null);
      setSentimentError(
        error.response?.data?.message || "Couldn't analyze sentiment."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-200 flex-col py-8">
      <div className="w-[95%] max-w-[500px] h-[400px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg">
        <div className="w-[100%] h-[50%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold">
          <GiConfirmed className="w-[100px] h-[100px] text-[green]" />
          Booking Confirmed
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px] ">
          <span>Booking Id :</span> <span>{bookingData._id}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px] ">
          <span>Owner Details :</span> <span>{bookingData.host?.email}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px] ">
          <span>Total Rent :</span> <span>{bookingData.totalRent}</span>
        </div>
      </div>

      <div className="w-[95%] max-w-[700px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[25px] p-[30px] md:w-[80%] rounded-xl shadow-lg">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
          <p className="text-gray-600 text-sm">Help others by rating and reviewing your stay</p>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center gap-3">
            <label className="text-lg font-semibold text-gray-700">
              Rate your experience
            </label>
            <div className="flex items-center gap-3">
              <Star onRate={handleStar} />
              <span className="text-xl font-bold text-gray-800">
                {star > 0 ? `${star} / 5` : "Not rated"}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <label className="text-lg font-semibold text-gray-700">
              Write a review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-[150px] max-h-[200px] bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
              placeholder="Tell us about your stay... What did you like? What could be improved?"
            />
            <div className="text-xs text-gray-500 text-right">
              {reviewText.length} characters
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !reviewText.trim()}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "🔍 Analyze Sentiment"
              )}
            </button>

            {sentimentResult && (
              <div className="w-full rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-semibold text-gray-800">Analysis Result:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${
                    sentimentResult.label === "positive" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {sentimentResult.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-md p-2">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {(sentimentResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-white rounded-md p-2">
                    <span className="text-gray-600">Suggested Rating:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {sentimentResult.rating} / 5 ⭐
                    </span>
                  </div>
                </div>
                {sentimentResult.positiveProbability && (
                  <div className="mt-3 bg-white rounded-md p-2 text-xs text-gray-600">
                    Positive: {(sentimentResult.positiveProbability * 100).toFixed(1)}% | 
                    Negative: {(sentimentResult.negativeProbability * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            )}

            {sentimentError && (
              <div className="w-full rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm text-red-700">
                ⚠️ {sentimentError}
              </div>
            )}
          </div>

          <button
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => handleSubmit(cardDetails._id)}
            disabled={!reviewText.trim() || star === 0}
          >
            {star === 0 ? "Please rate your experience" : "Submit Review & Rating"}
          </button>
        </div>
      </div>

      <button
        className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap absolute top-[10px] right-[20px]"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Booked;
