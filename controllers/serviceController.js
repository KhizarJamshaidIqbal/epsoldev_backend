import Service from '../models/Service.js';
import SiteSettings from '../models/SiteSettings.js';

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by featured if provided
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const services = await Service.find(query).sort({ order: 1, title: 1 });
    
    // Get site settings for price visibility
    const settings = await SiteSettings.getSettings();
    
    // If prices should be hidden, remove price information
    if (!settings.services.showPrices) {
      services.forEach(service => {
        service.price = undefined;
        service.priceDisplay = settings.services.defaultPriceDisplay;
      });
    }
    
    return res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};

// Get a single service by ID or slug
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      // If not, treat as slug
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get site settings for price visibility
    const settings = await SiteSettings.getSettings();
    
    // If prices should be hidden, remove price information
    if (!settings.services.showPrices) {
      service.price = undefined;
      service.priceDisplay = settings.services.defaultPriceDisplay;
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({ message: 'Failed to fetch service', error: error.message });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    console.log('Creating service with data:', req.body);
    const { title } = req.body;

    // Check if service with the same title already exists
    const existingService = await Service.findOne({ title });

    if (existingService) {
      return res.status(409).json({ message: 'Service with this title already exists' });
    }

    const newService = new Service(req.body);
    console.log('New service object before save:', newService);
    const savedService = await newService.save();
    console.log('Saved service:', savedService);
    return res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Find by ID or slug
    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if another service with the same title exists
    if (title !== service.title) {
      const existingService = await Service.findOne({
        _id: { $ne: service._id },
        title
      });

      if (existingService) {
        return res.status(409).json({ message: 'Service with this title already exists' });
      }
    }

    // Update with new values
    const updatedService = await Service.findByIdAndUpdate(
      service._id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(service._id);
    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};

// Get featured services
export const getFeaturedServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const services = await Service.find({ 
      featured: true, 
      status: 'active' 
    })
    .sort({ order: 1, title: 1 })
    .limit(parseInt(limit));

    // Get site settings for price visibility
    const settings = await SiteSettings.getSettings();
    
    // If prices should be hidden, remove price information
    if (!settings.services.showPrices) {
      services.forEach(service => {
        service.price = undefined;
        service.priceDisplay = settings.services.defaultPriceDisplay;
      });
    }

    return res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return res.status(500).json({ message: 'Failed to fetch featured services', error: error.message });
  }
};
