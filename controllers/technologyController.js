import Technology from '../models/Technology.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// @desc    Get all technologies
// @route   GET /api/technologies
// @access  Public
export const getAllTechnologies = asyncHandler(async (req, res) => {
  console.log('🔍 getAllTechnologies called');
  
  const { category, status, featured, search, sort = 'name', order = 'asc' } = req.query;
  
  // Build query
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (status) {
    query.status = status;
  }
  
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;
  
  console.log('🔍 Query:', query);
  console.log('🔍 Sort:', sortObj);
  
  const technologies = await Technology.find(query)
    .sort(sortObj)
    .select('-__v');
  
  console.log('🔍 Found technologies:', technologies.length);
  
  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies
  });
});

// @desc    Get single technology
// @route   GET /api/technologies/:id
// @access  Public
export const getTechnology = asyncHandler(async (req, res) => {
  const technology = await Technology.findById(req.params.id).select('-__v');
  
  if (!technology) {
    return res.status(404).json({
      success: false,
      message: 'Technology not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: technology
  });
});

// @desc    Create new technology
// @route   POST /api/technologies
// @access  Private
export const createTechnology = asyncHandler(async (req, res) => {
  const technology = await Technology.create(req.body);
  
  res.status(201).json({
    success: true,
    data: technology
  });
});

// @desc    Update technology
// @route   PUT /api/technologies/:id
// @access  Private
export const updateTechnology = asyncHandler(async (req, res) => {
  let technology = await Technology.findById(req.params.id);
  
  if (!technology) {
    return res.status(404).json({
      success: false,
      message: 'Technology not found'
    });
  }
  
  technology = await Technology.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-__v');
  
  res.status(200).json({
    success: true,
    data: technology
  });
});

// @desc    Delete technology
// @route   DELETE /api/technologies/:id
// @access  Private
export const deleteTechnology = asyncHandler(async (req, res) => {
  const technology = await Technology.findById(req.params.id);
  
  if (!technology) {
    return res.status(404).json({
      success: false,
      message: 'Technology not found'
    });
  }
  
  await technology.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Technology deleted successfully'
  });
});

// @desc    Get technology categories
// @route   GET /api/technologies/categories
// @access  Public
export const getTechnologyCategories = asyncHandler(async (req, res) => {
  const categories = await Technology.distinct('category');
  
  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get featured technologies
// @route   GET /api/technologies/featured
// @access  Public
export const getFeaturedTechnologies = asyncHandler(async (req, res) => {
  const technologies = await Technology.find({ 
    featured: true, 
    status: 'active' 
  })
    .sort({ order: 1, name: 1 })
    .select('-__v');
  
  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies
  });
});

// @desc    Bulk update technology usage count
// @route   PUT /api/technologies/usage-count
// @access  Private
export const updateUsageCount = asyncHandler(async (req, res) => {
  const { technologyIds } = req.body;
  
  if (!Array.isArray(technologyIds)) {
    return res.status(400).json({
      success: false,
      message: 'Technology IDs must be an array'
    });
  }
  
  // Update usage count for each technology
  const updatePromises = technologyIds.map(id => 
    Technology.findByIdAndUpdate(id, { $inc: { usageCount: 1 } })
  );
  
  await Promise.all(updatePromises);
  
  res.status(200).json({
    success: true,
    message: 'Usage counts updated successfully'
  });
});
