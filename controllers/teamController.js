import Team from '../models/Team.js';

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const { page = 1, limit = 12, status, department, search } = req.query;
    let query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by department if provided
    if (department && department !== 'all') {
      query.department = department;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const teamMembers = await Team.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Team.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    return res.status(200).json({
      teamMembers,
      totalItems,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return res.status(500).json({ message: 'Failed to fetch team members', error: error.message });
  }
};

// Get a single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findById(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    return res.status(200).json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return res.status(500).json({ message: 'Failed to fetch team member', error: error.message });
  }
};

// Create a new team member
export const createTeamMember = async (req, res) => {
  try {
    console.log('Creating team member with data:', req.body);
    
    // If no order is provided, set it to the next available order
    if (!req.body.order) {
      const maxOrder = await Team.findOne().sort({ order: -1 });
      req.body.order = maxOrder ? maxOrder.order + 1 : 1;
    }
    
    const newTeamMember = new Team(req.body);
    console.log('New team member object before save:', newTeamMember);
    const savedTeamMember = await newTeamMember.save();
    console.log('Saved team member:', savedTeamMember);
    return res.status(201).json(savedTeamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create team member', error: error.message });
  }
};

// Update a team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findById(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Update with new values
    const updatedTeamMember = await Team.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTeamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update team member', error: error.message });
  }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findById(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await Team.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return res.status(500).json({ message: 'Failed to delete team member', error: error.message });
  }
};

// Update team member order
export const updateTeamMemberOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOrder } = req.body;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const oldOrder = teamMember.order;
    
    if (newOrder > oldOrder) {
      // Moving down: decrease order of items between old and new position
      await Team.updateMany(
        { order: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { order: -1 } }
      );
    } else if (newOrder < oldOrder) {
      // Moving up: increase order of items between new and old position
      await Team.updateMany(
        { order: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }

    // Update the target team member's order
    teamMember.order = newOrder;
    await teamMember.save();

    return res.status(200).json(teamMember);
  } catch (error) {
    console.error('Error updating team member order:', error);
    return res.status(500).json({ message: 'Failed to update team member order', error: error.message });
  }
};

// Get active team members
export const getActiveTeamMembers = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const teamMembers = await Team.find({ status: 'active' })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json(teamMembers);
  } catch (error) {
    console.error('Error fetching active team members:', error);
    return res.status(500).json({ message: 'Failed to fetch active team members', error: error.message });
  }
};
