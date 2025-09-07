import ProjectRequest from '../models/ProjectRequest.js';

// Get all project requests
export const getAllProjectRequests = async (req, res) => {
  try {
    const { page = 1, limit = 12, status, priority, search } = req.query;
    let query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by priority if provided
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { projectType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projectRequests = await ProjectRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await ProjectRequest.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.status(200).json({
      projectRequests,
      totalItems,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching project requests:', error);
    return res.status(500).json({ message: 'Failed to fetch project requests', error: error.message });
  }
};

// Get a single project request by ID
export const getProjectRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    return res.status(200).json(projectRequest);
  } catch (error) {
    console.error('Error fetching project request:', error);
    return res.status(500).json({ message: 'Failed to fetch project request', error: error.message });
  }
};

// Create a new project request
export const createProjectRequest = async (req, res) => {
  try {
    console.log('Creating project request with data:', req.body);
    const newProjectRequest = new ProjectRequest(req.body);
    console.log('New project request object before save:', newProjectRequest);
    const savedProjectRequest = await newProjectRequest.save();
    console.log('Saved project request:', savedProjectRequest);
    return res.status(201).json(savedProjectRequest);
  } catch (error) {
    console.error('Error creating project request:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create project request', error: error.message });
  }
};

// Update a project request
export const updateProjectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    // Update with new values
    const updatedProjectRequest = await ProjectRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProjectRequest);
  } catch (error) {
    console.error('Error updating project request:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update project request', error: error.message });
  }
};

// Delete a project request
export const deleteProjectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    await ProjectRequest.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Project request deleted successfully' });
  } catch (error) {
    console.error('Error deleting project request:', error);
    return res.status(500).json({ message: 'Failed to delete project request', error: error.message });
  }
};

// Update project request status
export const updateProjectRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const projectRequest = await ProjectRequest.findById(id);
    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    projectRequest.status = status;
    const updatedProjectRequest = await projectRequest.save();

    return res.status(200).json(updatedProjectRequest);
  } catch (error) {
    console.error('Error updating project request status:', error);
    return res.status(500).json({ message: 'Failed to update project request status', error: error.message });
  }
};

// Get project requests by status
export const getProjectRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { limit = 10 } = req.query;
    
    const projectRequests = await ProjectRequest.find({ status })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json(projectRequests);
  } catch (error) {
    console.error('Error fetching project requests by status:', error);
    return res.status(500).json({ message: 'Failed to fetch project requests by status', error: error.message });
  }
};

// Get project request statistics
export const getProjectRequestStats = async (req, res) => {
  try {
    const stats = await ProjectRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await ProjectRequest.countDocuments();
    const recentRequests = await ProjectRequest.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    return res.status(200).json({
      statusBreakdown: stats,
      totalRequests,
      recentRequests
    });
  } catch (error) {
    console.error('Error fetching project request stats:', error);
    return res.status(500).json({ message: 'Failed to fetch project request stats', error: error.message });
  }
};
