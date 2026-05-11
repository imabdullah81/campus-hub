const Listing = require("../models/Listing");
const { deleteImage } = require("../utils/cloudinary.utils");

/**
 * @desc    Create a new listing
 * @route   POST /api/listings
 * @access  Private
 */
exports.createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      sellerId: req.user.id,
    };

    const listing = await Listing.create(listingData);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};

/**
 * @desc    Get all listings with filters
 * @route   GET /api/listings
 * @access  Public
 */
exports.getAllListings = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, condition, page = 1, limit = 10 } = req.query;

    const query = { status: "available" };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const listings = await Listing.find(query)
      .populate("sellerId", "fullName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: listings.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
      data: listings,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};

/**
 * @desc    Get single listing
 * @route   GET /api/listings/:id
 * @access  Public
 */
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("sellerId", "fullName email");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};

/**
 * @desc    Update listing
 * @route   PUT /api/listings/:id
 * @access  Private (Owner only)
 */
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};

/**
 * @desc    Delete listing
 * @route   DELETE /api/listings/:id
 * @access  Private (Owner only)
 */
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      const deletePromises = listing.images.map(img => deleteImage(img.public_id));
      await Promise.all(deletePromises);
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};

/**
 * @desc    Get user's own listings
 * @route   GET /api/listings/my
 * @access  Private
 */
exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ sellerId: req.user.id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
  }
};
