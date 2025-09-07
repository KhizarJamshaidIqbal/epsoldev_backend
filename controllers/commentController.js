import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';

/**
 * Get all comments with pagination and filtering
 */
export const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, postId } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (postId) filter.postId = new mongoose.Types.ObjectId(postId);
    
    // Get comments with pagination
    let comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'profileImage')
      .lean();
    
    // Set authorAvatar from user's profileImage if not already set
    comments = comments.map(comment => {
      if (!comment.authorAvatar && comment.userId && comment.userId.profileImage) {
        comment.authorAvatar = comment.userId.profileImage;
      }
      // Remove userId from response to keep it clean
      delete comment.userId;
      return comment;
    });
    
    // Get total count for pagination
    const totalComments = await Comment.countDocuments(filter);
    
    // Enrich with blog post titles
    const postIds = [...new Set(comments.map(comment => comment.postId))];
    const posts = await Blog.find({ _id: { $in: postIds } })
      .select('title slug')
      .lean();
    
    // Create a map for quick lookup
    const postsMap = {};
    posts.forEach(post => {
      postsMap[post._id.toString()] = { title: post.title, slug: post.slug };
    });
    
    // Add post title to each comment
    const commentsWithPostInfo = comments.map(comment => {
      const postId = comment.postId.toString();
      return {
        ...comment,
        post: postsMap[postId] || { title: 'Unknown Post', slug: '' }
      };
    });
    
    res.status(200).json({
      comments: commentsWithPostInfo,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: parseInt(page),
      totalItems: totalComments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get comments for a specific blog post
 */
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10, status = 'approved' } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { 
      postId: new mongoose.Types.ObjectId(postId),
      status: status
    };
    
    // Get approved comments for the post with pagination
    let comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'profileImage')
      .lean();
    comments = comments.map(comment => {
      if (!comment.authorAvatar && comment.userId && comment.userId.profileImage) {
        comment.authorAvatar = comment.userId.profileImage;
      }
      delete comment.userId;
      return comment;
    });
    
    // Get total count for pagination
    const totalComments = await Comment.countDocuments(filter);
    
    res.status(200).json({
      comments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: parseInt(page),
      totalItems: totalComments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a new comment
 */
export const addComment = async (req, res) => {
  try {
    const { postId, authorName, authorEmail, content, userId, authorAvatar } = req.body;
    
    // Check if blog post exists
    const blogExists = await Blog.exists({ _id: postId });
    if (!blogExists) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check site settings for auto-approval
    const settings = await SiteSettings.getSettings();
    const autoApprove = settings?.comments?.autoApproveComments || false;
    
    // Create new comment with appropriate status based on settings
    const newComment = new Comment({
      postId,
      authorName,
      authorEmail,
      content,
      userId: userId || null,
      authorAvatar: authorAvatar || '',
      // Use auto-approve setting if available
      status: autoApprove ? 'approved' : 'pending'
    });
    
    await newComment.save();
    
    const message = autoApprove
      ? 'Comment submitted and automatically approved'
      : 'Comment submitted successfully and awaiting approval';
    
    res.status(201).json({
      comment: newComment,
      message
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update comment status (approve/reject)
 */
export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Updating comment status:', { id, status });
    
    if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: pending, approved, rejected, spam' 
      });
    }
    
    // Ensure we have a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return res.status(400).json({ message: 'Invalid comment ID format' });
    }
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      console.error('Comment not found with ID:', id);
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.status = status;
    await comment.save();
    
    console.log('Comment updated successfully:', comment);
    
    res.status(200).json({
      comment,
      message: `Comment ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating comment status:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ 
        message: 'Comment not found',
        success: false
      });
    }
    
    await Comment.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Comment deleted successfully',
      success: true
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

/**
 * Batch update comment statuses
 */
export const batchUpdateComments = async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No comment IDs provided' });
    }
    
    if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: pending, approved, rejected, spam' 
      });
    }
    
    const result = await Comment.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedAt: new Date() } }
    );
    
    res.status(200).json({
      message: `${result.modifiedCount} comments updated to ${status} status`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get comment statistics
 */
export const getCommentStats = async (req, res) => {
  try {
    const pending = await Comment.countDocuments({ status: 'pending' });
    const approved = await Comment.countDocuments({ status: 'approved' });
    const rejected = await Comment.countDocuments({ status: 'rejected' });
    const spam = await Comment.countDocuments({ status: 'spam' });
    const total = await Comment.countDocuments({});
    
    res.status(200).json({
      pending,
      approved,
      rejected,
      spam,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};