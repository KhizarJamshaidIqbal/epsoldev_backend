import Blog from '../models/Blog.js';

// Helper function to transform blog data with category and tag names
const transformBlogData = async (blog) => {
  let categoryName = 'Uncategorized';
  let tagNames = [];

  console.log('TransformBlogData - Starting transformation for blog:', blog.title);
  console.log('TransformBlogData - Blog tags:', blog.tags);
  console.log('TransformBlogData - Blog category:', blog.category);

  try {
    // Import models dynamically to avoid circular dependencies
    console.log('TransformBlogData - Importing models...');
    const Category = (await import('../models/BlogCategory.js')).default;
    const Tag = (await import('../models/Tag.js')).default;
    console.log('TransformBlogData - Models imported successfully');

    // Get category name
    if (blog.category) {
      // Check if category is already a name (not an ID)
      if (blog.category.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId, try to find the category
        const category = await Category.findById(blog.category);
        if (category) {
          categoryName = category.name;
          console.log('TransformBlogData - Found category by ID:', categoryName);
        }
      } else {
        // It's already a name
        categoryName = blog.category;
        console.log('TransformBlogData - Category is already a name:', categoryName);
      }
    }

    // Get tag names
    if (blog.tags && blog.tags.length > 0) {
      console.log('TransformBlogData - Looking for tags with IDs:', blog.tags);
      
      // Separate IDs and names
      const tagIds = blog.tags.filter(tag => tag.match(/^[0-9a-fA-F]{24}$/));
      const existingTagNames = blog.tags.filter(tag => !tag.match(/^[0-9a-fA-F]{24}$/));
      
      console.log('TransformBlogData - Tag IDs:', tagIds);
      console.log('TransformBlogData - Tag names (already):', existingTagNames);
      
      // Find tags by IDs
      if (tagIds.length > 0) {
        const foundTags = await Tag.find({ _id: { $in: tagIds } });
        console.log('TransformBlogData - Found tags by ID:', foundTags);
        const resolvedTagNames = foundTags.map(tag => tag.name);
        console.log('TransformBlogData - Resolved tag names:', resolvedTagNames);
        tagNames = [...existingTagNames, ...resolvedTagNames];
      } else {
        tagNames = existingTagNames;
      }
      
      console.log('TransformBlogData - Final tag names:', tagNames);
    }
  } catch (modelError) {
    console.error('TransformBlogData - Error resolving category/tag names:', modelError);
    console.error('TransformBlogData - Error stack:', modelError.stack);
  }

  const result = {
    ...blog.toObject(),
    authorName: blog.author?.name || '',
    featuredImage: blog.image || '',
    metaTitle: blog.title,
    metaDescription: blog.excerpt,
    categoryName: categoryName,
    tagNames: tagNames.join(', ')
  };

  console.log('TransformBlogData - Final result tagNames:', result.tagNames);
  return result;
};

// Helper function to transform multiple blogs efficiently
const transformBlogsData = async (blogs) => {
  let categoryMap = new Map();
  let tagMap = new Map();

  try {
    // Import models dynamically to avoid circular dependencies
    const Category = (await import('../models/BlogCategory.js')).default;
    const Tag = (await import('../models/Tag.js')).default;

    // Get all unique category IDs
    const categoryIds = [...new Set(blogs.map(blog => blog.category).filter(Boolean))].filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    if (categoryIds.length > 0) {
      const categories = await Category.find({ _id: { $in: categoryIds } });
      categories.forEach(cat => categoryMap.set(cat._id.toString(), cat.name));
    }

    // Get all unique tag IDs
    const tagIds = [...new Set(blogs.flatMap(blog => blog.tags || []))].filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    if (tagIds.length > 0) {
      const tags = await Tag.find({ _id: { $in: tagIds } });
      tags.forEach(tag => tagMap.set(tag._id.toString(), tag.name));
    }
  } catch (modelError) {
    console.error('TransformBlogsData - Error resolving category/tag names:', modelError);
    console.error('TransformBlogsData - Error stack:', modelError.stack);
  }

  return blogs.map(blog => ({
    ...blog.toObject(),
    authorName: blog.author?.name || '',
    featuredImage: blog.image || '',
    metaTitle: blog.title,
    metaDescription: blog.excerpt,
    categoryName: blog.category?.match(/^[0-9a-fA-F]{24}$/) ? 
      (categoryMap.get(blog.category?.toString()) || 'Uncategorized') : 
      (blog.category || 'Uncategorized'),
    tagNames: (blog.tags || []).map(tag => 
      tag.match(/^[0-9a-fA-F]{24}$/) ? 
        (tagMap.get(tag.toString()) || tag) : 
        tag
    ).join(', ')
  }));
};

// Get all blog posts (with pagination)
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    
    // Build query based on filters
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Transform blogs to match frontend expectations
    const transformedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    }));

    // Get total documents
    const count = await Blog.countDocuments(query);

    // Return response with pagination info
    return res.status(200).json({
      blogs: transformedBlogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

// Get a single blog post by ID or slug
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    } else {
      // If not, treat as slug
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    // Transform blog to match frontend expectations
    const transformedBlog = {
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    };

    return res.status(200).json(transformedBlog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    // Resolve category/displayCategory to satisfy schema requirements
    let resolvedCategory = req.body.category;
    let resolvedDisplayCategory = req.body.displayCategory;
    try {
      if (!resolvedDisplayCategory || !resolvedCategory) {
        const Category = (await import('../models/BlogCategory.js')).default;
        // If category looks like an ObjectId, try to fetch its name
        if (resolvedCategory && resolvedCategory.match && resolvedCategory.match(/^[0-9a-fA-F]{24}$/)) {
          const foundCategory = await Category.findById(resolvedCategory);
          if (foundCategory?.name) {
            resolvedCategory = foundCategory.name;
            resolvedDisplayCategory = resolvedDisplayCategory || foundCategory.name;
          }
        }
      }
      // Fallback: if still missing displayCategory, mirror category value
      if (!resolvedDisplayCategory && resolvedCategory) {
        resolvedDisplayCategory = resolvedCategory;
      }
    } catch (catErr) {
      // Do not fail creation because category name resolution failed
      console.warn('Category resolution warning (createBlog):', catErr?.message);
      if (!resolvedDisplayCategory && resolvedCategory) {
        resolvedDisplayCategory = resolvedCategory;
      }
    }

    // Transform frontend data to database format
    const blogData = {
      ...req.body,
      category: resolvedCategory,
      displayCategory: resolvedDisplayCategory,
      author: {
        name: req.body.authorName || 'Admin',
        avatar: req.body.authorAvatar || 'https://via.placeholder.com/150'
      },
      image: req.body.featuredImage || req.body.image || ''
    };

    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();

    // Transform response to match frontend expectations
    const transformedBlog = {
      ...savedBlog.toObject(),
      authorName: savedBlog.author?.name || '',
      featuredImage: savedBlog.image || '',
      metaTitle: savedBlog.title,
      metaDescription: savedBlog.excerpt
    };

    return res.status(201).json(transformedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Resolve category/displayCategory similar to create path
    let resolvedCategory = req.body.category ?? blog.category;
    let resolvedDisplayCategory = req.body.displayCategory ?? blog.displayCategory;
    try {
      if (!resolvedDisplayCategory || (resolvedCategory && resolvedCategory.match && resolvedCategory.match(/^[0-9a-fA-F]{24}$/))) {
        const Category = (await import('../models/BlogCategory.js')).default;
        if (resolvedCategory && resolvedCategory.match && resolvedCategory.match(/^[0-9a-fA-F]{24}$/)) {
          const foundCategory = await Category.findById(resolvedCategory);
          if (foundCategory?.name) {
            resolvedCategory = foundCategory.name;
            resolvedDisplayCategory = resolvedDisplayCategory || foundCategory.name;
          }
        }
      }
      if (!resolvedDisplayCategory && resolvedCategory) {
        resolvedDisplayCategory = resolvedCategory;
      }
    } catch (catErr) {
      console.warn('Category resolution warning (updateBlog):', catErr?.message);
      if (!resolvedDisplayCategory && resolvedCategory) {
        resolvedDisplayCategory = resolvedCategory;
      }
    }

    // Transform frontend data to database format
    const updateData = {
      ...req.body,
      category: resolvedCategory,
      displayCategory: resolvedDisplayCategory,
      author: {
        name: req.body.authorName || blog.author?.name || 'Admin',
        avatar: req.body.authorAvatar || blog.author?.avatar || 'https://via.placeholder.com/150'
      },
      image: req.body.featuredImage || req.body.image || blog.image || ''
    };

    // Update with new values
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      updateData,
      { new: true, runValidators: true }
    );

    // Transform response to match frontend expectations
    const transformedBlog = {
      ...updatedBlog.toObject(),
      authorName: updatedBlog.author?.name || '',
      featuredImage: updatedBlog.image || '',
      metaTitle: updatedBlog.title,
      metaDescription: updatedBlog.excerpt
    };

    return res.status(200).json(transformedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(blog._id);
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};

// Get related blog posts
export const getRelatedBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Find blogs in the same category, excluding the current blog
    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      status: 'published'
    })
    .limit(3)
    .sort({ createdAt: -1 });

    // Transform blogs to match frontend expectations
    const transformedBlogs = relatedBlogs.map(blog => ({
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    }));
    
    return res.status(200).json(transformedBlogs);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return res.status(500).json({ message: 'Failed to fetch related blogs', error: error.message });
  }
};

// PUBLIC API ENDPOINTS

// Get all published blog posts for public consumption
export const getPublishedBlogs = async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      console.warn('Database not connected, returning empty blog list');
      return res.status(200).json({
        blogs: [],
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
        message: 'Database temporarily unavailable'
      });
    }

    const { page = 1, limit = 10, category, search } = req.query;
    
    // Build query based on filters - only show published posts
    const query = { status: 'published' };
    if (category) query.category = category;
    
    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Transform blogs to match frontend expectations
    const transformedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    }));

    // Get total documents
    const count = await Blog.countDocuments(query);

    // Return response with pagination info
    return res.status(200).json({
      blogs: transformedBlogs,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    return res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

// Get featured blog posts (latest published posts)
export const getFeaturedBlogs = async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      console.warn('Database not connected, returning empty featured blogs list');
      return res.status(200).json([]);
    }

    const { limit = 3 } = req.query;
    
    const featuredBlogs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1, views: -1 }) // Sort by newest and most viewed
      .limit(parseInt(limit))
      .exec();

    // Transform blogs to match frontend expectations
    const transformedBlogs = featuredBlogs.map(blog => ({
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    }));
      
    return res.status(200).json(transformedBlogs);
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return res.status(500).json({ message: 'Failed to fetch featured blogs', error: error.message });
  }
};

// Get a blog post by slug for public viewing
export const getBlogBySlug = async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      console.warn('Database not connected, cannot fetch blog by slug');
      return res.status(503).json({ message: 'Database temporarily unavailable' });
    }

    const { slug } = req.params;
    console.log('getBlogBySlug called with slug:', slug);
    
    const blog = await Blog.findOne({ slug, status: 'published' });
    
    if (!blog) {
      console.log('Blog not found for slug:', slug);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    console.log('Found blog:', blog.title);
    console.log('Blog tags before transformation:', blog.tags);
    console.log('Blog category before transformation:', blog.category);

    // Transform blog to match frontend expectations
    const transformedBlog = await transformBlogData(blog);
    
    console.log('Transformed blog tagNames:', transformedBlog.tagNames);
    console.log('Transformed blog categoryName:', transformedBlog.categoryName);
    
    return res.status(200).json(transformedBlog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return res.status(500).json({ message: 'Failed to fetch blog post', error: error.message });
  }
};

// Get related blogs by slug
export const getRelatedBlogsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 3 } = req.query;
    
    // Find the source blog post
    const blog = await Blog.findOne({ slug, status: 'published' });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Find related posts in the same category
    const relatedBlogs = await Blog.find({
      category: blog.category,
      slug: { $ne: slug },
      status: 'published'
    })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    // Transform blogs to match frontend expectations
    const transformedBlogs = relatedBlogs.map(blog => ({
      ...blog.toObject(),
      authorName: blog.author?.name || '',
      featuredImage: blog.image || '',
      metaTitle: blog.title,
      metaDescription: blog.excerpt
    }));
    
    return res.status(200).json(transformedBlogs);
  } catch (error) {
    console.error('Error fetching related blogs by slug:', error);
    return res.status(500).json({ message: 'Failed to fetch related blog posts', error: error.message });
  }
};

// Increment view count for a blog post
export const incrementViewCount = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment view count
    blog.views = blog.views ? blog.views + 1 : 1;
    await blog.save();
    
    return res.status(200).json({ message: 'View count incremented' });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return res.status(500).json({ message: 'Failed to increment view count', error: error.message });
  }
};