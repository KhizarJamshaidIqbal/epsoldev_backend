import Portfolio from '../models/Portfolio.js';

// Get all portfolio projects
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search, featured } = req.query;
    let query = {};

    // Filter by category if provided
    if (category && category !== 'all') {
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

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await Portfolio.find(query)
      .sort({ featured: -1, completedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Portfolio.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.status(200).json({
      projects,
      totalItems,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

// Get a single project by ID or slug
export const getProjectById = async (req, res) => {
  try {
    // Handle both :id and :slug parameters
    const id = req.params.id || req.params.slug;
    
    // Check if id exists
    if (!id) {
      return res.status(400).json({ message: 'Project ID or slug is required' });
    }
    
    let project;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Portfolio.findById(id);
    } else {
      // If not, treat as slug
      project = await Portfolio.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const { title } = req.body;

    // Check if project with the same title already exists
    const existingProject = await Portfolio.findOne({ title });

    if (existingProject) {
      return res.status(409).json({ message: 'Project with this title already exists' });
    }

    const newProject = new Portfolio(req.body);
    console.log('New project object before save:', newProject);
    const savedProject = await newProject.save();
    console.log('Saved project:', savedProject);
    return res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Find by ID or slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Portfolio.findById(id);
    } else {
      project = await Portfolio.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if another project with the same title exists
    if (title !== project.title) {
      const existingProject = await Portfolio.findOne({
        _id: { $ne: project._id },
        title
      });

      if (existingProject) {
        return res.status(409).json({ message: 'Project with this title already exists' });
      }
    }

    // Update with new values
    const updatedProject = await Portfolio.findByIdAndUpdate(
      project._id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Portfolio.findById(id);
    } else {
      project = await Portfolio.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Portfolio.findByIdAndDelete(project._id);
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

// Get featured projects
export const getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const projects = await Portfolio.find({ 
      featured: true, 
      status: 'published' 
    })
    .sort({ completedAt: -1, createdAt: -1 })
    .limit(parseInt(limit));

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return res.status(500).json({ message: 'Failed to fetch featured projects', error: error.message });
  }
};

// Toggle featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Portfolio.findById(id);
    } else {
      project = await Portfolio.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.featured = !project.featured;
    const updatedProject = await project.save();

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return res.status(500).json({ message: 'Failed to toggle featured status', error: error.message });
  }
};
