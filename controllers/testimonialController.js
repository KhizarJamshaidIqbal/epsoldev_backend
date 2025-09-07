import Testimonial from '../models/Testimonial.js';

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 12, status, featured, search } = req.query;
    let query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by featured if provided
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Testimonial.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.status(200).json({
      testimonials,
      totalItems,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
  }
};

// Get a single testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.status(200).json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return res.status(500).json({ message: 'Failed to fetch testimonial', error: error.message });
  }
};

// Create a new testimonial
export const createTestimonial = async (req, res) => {
  try {
    console.log('Creating testimonial with data:', req.body);
    const newTestimonial = new Testimonial(req.body);
    console.log('New testimonial object before save:', newTestimonial);
    const savedTestimonial = await newTestimonial.save();
    console.log('Saved testimonial:', savedTestimonial);
    return res.status(201).json(savedTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
  }
};

// Update a testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Update with new values
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
  }
};

// Delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
  }
};

// Get featured testimonials
export const getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const testimonials = await Testimonial.find({ 
      featured: true, 
      status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    return res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return res.status(500).json({ message: 'Failed to fetch featured testimonials', error: error.message });
  }
};

// Toggle featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.featured = !testimonial.featured;
    const updatedTestimonial = await testimonial.save();

    return res.status(200).json(updatedTestimonial);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return res.status(500).json({ message: 'Failed to toggle featured status', error: error.message });
  }
};
