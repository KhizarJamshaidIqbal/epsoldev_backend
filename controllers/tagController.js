import Tag from '../models/Tag.js';

// Get all tags
export const getAllTags = async (req, res) => {
  try {
    console.log('🏷️  getAllTags called');
    console.log('📊 Query params:', req.query);
    
    const { type, search } = req.query;
    let query = {};

    // Filter by type if provided
    if (type) {
      query.type = type;
      console.log('🔍 Filtering by type:', type);
    }

    // Search by name or description if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      console.log('🔍 Searching with term:', search);
    }

    console.log('📝 Final query:', JSON.stringify(query));
    const tags = await Tag.find(query).sort({ name: 1 });
    console.log(`✅ Found ${tags.length} tags`);
    
    return res.status(200).json(tags);
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return res.status(500).json({ message: 'Failed to fetch tags', error: error.message });
  }
};

// Get a single tag by ID or slug
export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    let tag;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tag = await Tag.findById(id);
    } else {
      // If not, treat as slug
      tag = await Tag.findOne({ slug: id });
    }

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return res.status(500).json({ message: 'Failed to fetch tag', error: error.message });
  }
};

// Create a new tag
export const createTag = async (req, res) => {
  try {
    console.log('Creating tag with data:', req.body);
    const { name, slug } = req.body;

    // Check if tag with the same name or slug already exists
    const existingTag = await Tag.findOne({
      $or: [{ name }, { slug }]
    });

    if (existingTag) {
      return res.status(409).json({ message: 'Tag with this name or slug already exists' });
    }

    const newTag = new Tag(req.body);
    console.log('New tag object before save:', newTag);
    const savedTag = await newTag.save();
    console.log('Saved tag:', savedTag);
    return res.status(201).json(savedTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create tag', error: error.message });
  }
};

// Update a tag
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Find by ID or slug
    let tag;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tag = await Tag.findById(id);
    } else {
      tag = await Tag.findOne({ slug: id });
    }

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if another tag with the same name or slug exists
    if (name !== tag.name || slug !== tag.slug) {
      const existingTag = await Tag.findOne({
        _id: { $ne: tag._id },
        $or: [
          { name },
          { slug }
        ]
      });

      if (existingTag) {
        return res.status(409).json({ message: 'Tag with this name or slug already exists' });
      }
    }

    // Update with new values
    const updatedTag = await Tag.findByIdAndUpdate(
      tag._id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update tag', error: error.message });
  }
};

// Delete a tag
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let tag;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tag = await Tag.findById(id);
    } else {
      tag = await Tag.findOne({ slug: id });
    }

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await Tag.findByIdAndDelete(tag._id);
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return res.status(500).json({ message: 'Failed to delete tag', error: error.message });
  }
};

// Get popular tags
export const getPopularTags = async (req, res) => {
  try {
    const { limit = 10, type } = req.query;
    let query = {};

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    const tags = await Tag.find(query)
      .sort({ count: -1, name: 1 })
      .limit(parseInt(limit));

    return res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return res.status(500).json({ message: 'Failed to fetch popular tags', error: error.message });
  }
};

// Update tag count (used when blogs/posts are created/updated/deleted)
export const updateTagCount = async (tagIds, increment = true) => {
  try {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return;

    const operation = increment ? 1 : -1;
    await Tag.updateMany(
      { _id: { $in: tagIds } },
      { $inc: { count: operation } }
    );
  } catch (error) {
    console.error('Error updating tag count:', error);
  }
};

// Debug endpoint to check database connection and tags
export const debugTags = async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const dbState = mongoose.default.connection.readyState;
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    console.log('🔍 Debug Tags Endpoint Called');
    console.log('📊 Database State:', stateMap[dbState]);
    console.log('🗄️  Database Name:', mongoose.default.connection.name);
    console.log('🏷️  Collection Name:', Tag.collection.name);
    
    const totalTags = await Tag.countDocuments();
    console.log('📈 Total tags in database:', totalTags);
    
    const allTags = await Tag.find({}).limit(5);
    console.log('📝 Sample tags:', allTags.map(t => ({ name: t.name, type: t.type })));
    
    return res.status(200).json({
      database: {
        state: stateMap[dbState],
        name: mongoose.default.connection.name,
        host: mongoose.default.connection.host
      },
      collection: Tag.collection.name,
      totalTags,
      sampleTags: allTags.map(t => ({ id: t._id, name: t.name, type: t.type }))
    });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return res.status(500).json({ message: 'Debug failed', error: error.message });
  }
};
