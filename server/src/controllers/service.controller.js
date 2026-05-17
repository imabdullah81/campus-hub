const Service = require("../models/Service");
const { deleteImage } = require("../utils/cloudinary.utils");

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private
 */
exports.createService = async (req, res, next) => {
  try {
    const serviceData = {
      ...req.body,
      providerId: req.user.id,
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all services with filters
 * @route   GET /api/services
 * @access  Public
 */
exports.getAllServices = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, pricingType, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (pricingType) query.pricingType = pricingType;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (page - 1) * limit;
    const services = await Service.find(query)
      .populate("providerId", "fullName email profileImage")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
      data: services,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single service
 * @route   GET /api/services/:id
 * @access  Public
 */
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "fullName email profileImage");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Increment views
    service.views += 1;
    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private (Owner only)
 */
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check ownership
    if (service.providerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this service" });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private (Owner only)
 */
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check ownership
    if (service.providerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this service" });
    }

    // Delete images from Cloudinary
    if (service.images && service.images.length > 0) {
      const deletePromises = service.images.map(img => deleteImage(img.public_id));
      await Promise.all(deletePromises);
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user's own services
 * @route   GET /api/services/user/me
 * @access  Private
 */
exports.getMyServices = async (req, res, next) => {
  try {
    const services = await Service.find({ providerId: req.user.id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    if (typeof next === 'function') next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};
