import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import { analyzeReviewText } from "../services/sentiment.service.js";

export const addListing = async (req, res) => {
  try {
    let host = req.userId;
    let { title, description, rent, city, landMark, category } = req.body;
    let image1 = await uploadOnCloudinary(req.files.image1[0].path);
    let image2 = await uploadOnCloudinary(req.files.image2[0].path);
    let image3 = await uploadOnCloudinary(req.files.image3[0].path);

    let listing = await Listing.create({
      title,
      description,
      rent,
      city,
      landMark,
      category,
      image1,
      image2,
      image3,
      host,
    });
    let user = await User.findByIdAndUpdate(
      host,
      { $push: { listing: listing._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "user is not found " });
    }
    return res.status(201).json(listing);
  } catch (error) {
    return res.status(500).json({ message: `AddListing error ${error}` });
  }
};

export const getListing = async (req, res) => {
  try {
    let listing = await Listing.find().sort({ createdAt: -1 });
    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json({ message: `getListing error ${error}` });
  }
};

export const findListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "listing not found" });
    }
    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json(`findListing error ${error}`);
  }
};
export const updateListing = async (req, res) => {
  try {
    let image1;
    let image2;
    let image3;
    let { id } = req.params;
    let { title, description, rent, city, landMark, category } = req.body;
    if (req.files.image1) {
      image1 = await uploadOnCloudinary(req.files.image1[0].path);
    }
    if (req.files.image2) {
      image2 = await uploadOnCloudinary(req.files.image2[0].path);
    }
    if (req.files.image3) {
      image3 = await uploadOnCloudinary(req.files.image3[0].path);
    }

    let listing = await Listing.findByIdAndUpdate(
      id,
      {
        title,
        description,
        rent,
        city,
        landMark,
        category,
        image1,
        image2,
        image3,
      },
      { new: true }
    );

    return res.status(201).json(listing);
  } catch (error) {
    return res.status(500).json({ message: `UpdateListing Error ${error}` });
  }
};

export const deleteListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    let user = await User.findByIdAndUpdate(
      listing.host,
      {
        $pull: { listing: listing._id },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "user is not found" });
    }
    return res.status(201).json({ message: "Listing deleted" });
  } catch (error) {
    return res.status(500).json({ message: `DeleteListing Error ${error}` });
  }
};

export const ratingListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratings } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.ratings = Number(ratings);
    await listing.save();

    return res.status(200).json({ ratings: listing.ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Rating error" });
  }
};

export const reviewListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { review } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (!review || !review.trim()) {
      return res
        .status(400)
        .json({ message: "Review text is required to submit feedback" });
    }

    const sentiment = await analyzeReviewText(review);

    listing.reviews.push({
      text: review,
      sentiment: sentiment?.label || "unknown",
      confidence: sentiment?.confidence ?? null,
      positiveProbability: sentiment?.positiveProbability ?? null,
      negativeProbability: sentiment?.negativeProbability ?? null,
      rating: sentiment?.rating ?? null,
      analyzedAt: new Date(),
    });
    await listing.save();

    return res
      .status(200)
      .json({ review: listing.reviews, sentiment: sentiment || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Rating error" });
  }
};



export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const listing = await Listing.find({
      $or: [
        { landMark: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(listing);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { limit = 6, minRating = 3.5 } = req.query;

    // Get highly rated hotels that are not booked
    const recommendations = await Listing.find({
      isBooked: false,
      ratings: { $gte: Number(minRating) },
    })
      .sort({ ratings: -1, createdAt: -1 }) // Sort by rating (descending), then by newest
      .limit(Number(limit))
      .populate("host", "email")
      .select("-reviews"); // Exclude reviews for performance

    // If we don't have enough high-rated hotels, fill with other available hotels
    if (recommendations.length < Number(limit)) {
      const additional = await Listing.find({
        isBooked: false,
        _id: { $nin: recommendations.map((r) => r._id) },
      })
        .sort({ ratings: -1, createdAt: -1 })
        .limit(Number(limit) - recommendations.length)
        .populate("host", "email")
        .select("-reviews");

      recommendations.push(...additional);
    }

    return res.status(200).json({
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};