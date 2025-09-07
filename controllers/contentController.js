import Content from '../models/Content.js';

// Get all content
export const getAllContent = async (req, res) => {
  try {
    const content = await Content.find().sort({ type: 1 });
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get content by type
export const getContentByType = async (req, res) => {
  try {
    const { type } = req.params;
    const content = await Content.findOne({ type });
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create content
export const createContent = async (req, res) => {
  try {
    const content = new Content({
      ...req.body,
      createdBy: req.user?._id || '507f1f77bcf86cd799439011'
    });
    await content.save();
    res.status(201).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update content
export const updateContent = async (req, res) => {
  try {
    const { type } = req.params;
    const content = await Content.findOneAndUpdate(
      { type },
      { ...req.body, updatedBy: req.user?._id || '507f1f77bcf86cd799439011' },
      { new: true, runValidators: true }
    );
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete content
export const deleteContent = async (req, res) => {
  try {
    const { type } = req.params;
    const content = await Content.findOneAndDelete({ type });
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    
    res.status(200).json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update content status
export const updateContentStatus = async (req, res) => {
  try {
    const { type } = req.params;
    const { status } = req.body;
    
    const content = await Content.findOneAndUpdate(
      { type },
      { status, updatedBy: req.user?._id || '507f1f77bcf86cd799439011' },
      { new: true }
    );
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get content stats
export const getContentStats = async (req, res) => {
  try {
    const stats = await Content.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
        }
      }
    ]);

    const typeStats = await Content.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, active: 0, draft: 0, archived: 0 },
        typeStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
